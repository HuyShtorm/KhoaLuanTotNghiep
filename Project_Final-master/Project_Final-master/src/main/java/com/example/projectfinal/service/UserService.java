package com.example.projectfinal.service;

import com.example.projectfinal.Entity.Role;
import com.example.projectfinal.Entity.User;
import com.example.projectfinal.Entity.User_;
import com.example.projectfinal.common.FilterRequest;
import com.example.projectfinal.constant.MessageError;
import com.example.projectfinal.enumStatic.UserRole;
import com.example.projectfinal.enumStatic.UserStatus;
import com.example.projectfinal.exception.NotFoundException;
import com.example.projectfinal.exception.ServiceException;
import com.example.projectfinal.repository.RoleRepository;
import com.example.projectfinal.repository.UserRepository;
import com.example.projectfinal.request.SearchRequest;
import com.example.projectfinal.request.user.ActiveRequest;
import com.example.projectfinal.request.user.AdminUpdateStatusRequest;
import com.example.projectfinal.request.user.SignupRequest;
import com.example.projectfinal.response.user.UserResponse;
import com.example.projectfinal.util.DbUtil;
import com.example.projectfinal.util.MapperUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final OtpService otpService;  // Thêm OtpService để xử lý OTP
    // Map để lưu trữ người dùng tạm thời trước khi xác thực OTP
    private Map<String, SignupRequest> pendingUsers = new HashMap<>();

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, RoleRepository roleRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.otpService = otpService;  // Inject OtpService
    }
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found with email: " + email);
//        }
//        return user;
//    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Tìm kiếm người dùng trong cơ sở dữ liệu bằng email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // Trả về đối tượng UserDetailsImpl với thông tin người dùng
        return new UserDetailsImpl(user);
    }

    @PostConstruct
    public void initRoles() {
        if (roleRepository.findByName(UserRole.USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setRoleName(UserRole.USER);
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName(UserRole.ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName(UserRole.ADMIN);
            roleRepository.save(adminRole);
        }
    }
//    @Transactional
//    // Phương thức để đăng ký người dùng
//    public UserResponse createUser(SignupRequest request) {
//        log.info("Yêu cầu đăng ký: {}", request);
//
////        if (userRepository.existsByName(request.getName())) {
////            throw new RuntimeException("Username already exists");
////        }
//
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email đã được sử dụng , vui lòng sử dụng Email khác ! ");
//        }
//
//        // Lấy quyền ROLE_USER từ RoleRepository
//        Role userRole = roleRepository.findByName(UserRole.USER)
//                .orElseThrow(() -> new RuntimeException("User Role not set."));
//
//        // Tạo đối tượng User với vai trò mặc định là USER
//        User user = User.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .phone(request.getPhone())
//                .roles(Collections.singleton(userRole)) // Set quyền mặc định
//                .status(UserStatus.WAITING_CONFIRM)
//                .build();
//
//        user = userRepository.save(user);
//
//        // Sau khi tạo người dùng, gửi OTP qua email
//        otpService.generateAndSendOtp(user.getEmail());
//
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
  @Transactional
    public void savePendingUser(SignupRequest request) {
        pendingUsers.put(request.getEmail(), request);
    }
    @Transactional
    // Lấy người dùng tạm thời theo email
    public SignupRequest getPendingUser(String email) {
        return pendingUsers.get(email);
    }
    @Transactional
    // Xóa người dùng tạm thời sau khi xác thực thành công
    public void removePendingUser(String email) {
        pendingUsers.remove(email);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public void registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        try {
            log.info("Bắt đầu xử lý đăng ký cho email: {}", request.getEmail());
            otpService.generateAndSendOtp(request.getEmail());

            // Lưu tạm người dùng trước khi xác thực OTP
            savePendingUser(request);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý đăng ký", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Có lỗi xảy ra trong quá trình xử lý");
        }
    }


    @Transactional
    // Phương thức để kích hoạt người dùng sau khi xác thực OTP
    public void activateUser(String email) {
        SignupRequest pendingUser = getPendingUser(email);
        if (pendingUser == null) {
            throw new RuntimeException("Người dùng chưa được đăng ký hoặc đã bị xóa.");
        }

        // Tạo và lưu người dùng vào CSDL
        Role userRole = roleRepository.findByName(UserRole.USER)
                .orElseThrow(() -> new RuntimeException("User Role not set."));
        User user = User.builder()
                .name(pendingUser.getName())
                .email(pendingUser.getEmail())
                .password(passwordEncoder.encode(pendingUser.getPassword()))
                .phone(pendingUser.getPhone())
                .roles(Collections.singleton(userRole))
                .status(UserStatus.ACTIVE)  // Đặt trạng thái là ACTIVE sau khi xác thực
                .build();

        userRepository.save(user);

        // Xóa thông tin người dùng tạm thời khỏi bộ nhớ
        removePendingUser(email);
    }


    // Phương thức kích hoạt tài khoản sau khi xác thực OTP



    // Phương thức để phân quyền ADMIN cho người dùng
    public void assignAdminRole(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Role adminRole = roleRepository.findByName(UserRole.ADMIN)
                .orElseThrow(() -> new NotFoundException("Admin role not found"));

        user.getRoles().add(adminRole);
        userRepository.save(user);
    }





    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND + userId));
        return MapperUtil.mapObject(user, UserResponse.class);
    }

    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();
        return MapperUtil.mapObjectList(users, UserResponse.class);
    }

    public UserResponse updateUserStatus(String id, UserStatus status) {
        User user = userRepository.findById(id).orElseThrow(() -> new ServiceException("User not found"));
        user.setStatus(status);
        user = userRepository.save(user);
        return MapperUtil.mapObject(user, UserResponse.class);
    }

    // Tạo phương thức để xử lý active tài khoản với OTP
    public UserResponse activeWithOtp(ActiveRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found " + request.getUserId()));

        if (!otpService.verifyOtp(user.getEmail(), request.getOtp())) {
            throw new ServiceException("OTP không hợp lệ hoặc đã hết hạn, vui lòng thử lại.");
        }

        if (!UserStatus.WAITING_CONFIRM.equals(user.getStatus())) {
            throw new ServiceException("Tài khoản đã được kích hoạt trước đó");
        }

        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);
        return MapperUtil.mapObject(user, UserResponse.class);





    }

    public String adminUpdateStatus(AdminUpdateStatusRequest request){
        User user = userRepository.findById(request.getUserId()).orElseThrow(()-> new NotFoundException(MessageError.USER_NOT_FOUND+ request.getUserId()));

        if (UserStatus.WAITING_CONFIRM.equals(request.getStatus())|| UserStatus.WAITING_CONFIRM.equals(user.getStatus())) {
            throw new ServiceException("Trang thai ko hop le !");

        }
        if(user.getStatus().equals(request.getStatus())){
            throw new ServiceException("Trang thai trung voi trang thai cu !");

        }
        user.setStatus(request.getStatus());
        user=userRepository.save(user);
        return user.getStatus().toString();
    }

        public Page<UserResponse> search(SearchRequest request) {
        Specification<User> filterSpec = (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(criteriaBuilder.literal(1), criteriaBuilder.literal(1));

        if (Objects.nonNull(request.getFilters()) && !request.getFilters().isEmpty()) {
            for (FilterRequest filterReq : request.getFilters()) {
                if (User_.STATUS.equalsIgnoreCase(filterReq.getField())) {
                    filterSpec = filterSpec.and(DbUtil.createSpecification(filterReq));
                }
            }
        }

        // Đừng quên trả về một giá trị hợp lệ ở cuối phương thức
        // Nếu bạn đang tìm kiếm, bạn có thể thêm một câu lệnh return ở đây
        return userRepository.findAll(filterSpec, request.getPage().getPageable())
                .map(user -> MapperUtil.mapObject(user, UserResponse.class));
    }


}

//    public Page<UserResponse> search(SearchRequest request) {
//        Specification<User> filterSpec = (root, query, criteriaBuilder)
//                -> criteriaBuilder.equal(criteriaBuilder.literal(1), criteriaBuilder.literal(1));
//
//        if (Objects.nonNull(request.getFilters()) && !request.getFilters().isEmpty()) {
//
//            for (FilterRequest filterReq : request.getFilters()) {
//
//                if (User_.STATUS.equalsIgnoreCase(filterReq.getField())) {
//                    filterSpec = filterSpec.and(DbUtil.createSpecification(filterReq));
//                }
//            }
//        }
//
//
//
//    }














//public class UserService implements org.springframework.security.core.userdetails.UserDetailsService {
//
//    private final UserRepository userRepository;
//    private final BCryptPasswordEncoder passwordEncoder;
//    private final RoleRepository roleRepository;
//
//    @Autowired
//    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, RoleRepository roleRepository) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.roleRepository = roleRepository;
//    }
//    @PostConstruct
//    public void initRoles() {
//        if (roleRepository.findByName(UserRole.USER).isEmpty()) {
//            Role userRole = new Role();
//            userRole.setRoleName(UserRole.USER);
//            roleRepository.save(userRole);
//        }
//
//        if (roleRepository.findByName(UserRole.ADMIN).isEmpty()) {
//            Role adminRole = new Role();
//            adminRole.setRoleName(UserRole.ADMIN);
//            roleRepository.save(adminRole);
//        }
//    }
//
//    // Phương thức để đăng ký người dùng
//    public UserResponse createUser(SignupRequest request) {
//        log.info("Yêu cầu đăng ký: {}", request);
//
//        if (userRepository.existsByName(request.getName())) {
//            throw new RuntimeException("Username already exists");
//        }
//
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        // Lấy quyền ROLE_USER từ RoleRepository
//        Role userRole = roleRepository.findByName(UserRole.USER)
//                .orElseThrow(() -> new RuntimeException("User Role not set."));
//
//        // Tạo đối tượng User với vai trò mặc định là USER
//        User user = User.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .phone(request.getPhone())
//                .roles(Collections.singleton(userRole)) // Set quyền mặc định
//                .status(UserStatus.WAITING_CONFIRM)
//                .build();
//
//        user = userRepository.save(user);
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//
//    // Phương thức để phân quyền ADMIN cho người dùng
//    public void assignAdminRole(String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NotFoundException("User not found"));
//
//        Role adminRole = roleRepository.findByName(UserRole.ADMIN)
//                .orElseThrow(() -> new NotFoundException("Admin role not found"));
//
//        user.getRoles().add(adminRole);
//        userRepository.save(user);
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new UsernameNotFoundException("Người dùng không tồn tại");
//        }
//
//        // Chuyển đổi các role của người dùng sang SimpleGrantedAuthority
//        List<GrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleName().name()))
//                .collect(Collectors.toList());
//
//        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
//    }
//    // Phương thức để nạp thông tin người dùng cho Spring Security
////        @Override
////        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
////            User user = userRepository.findByEmail(email);
////            if (user == null) {
////                throw new UsernameNotFoundException("Người dùng không tồn tại");
////            }
////
////            // Chuyển đổi role của người dùng sang SimpleGrantedAuthority
////            List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
////
////            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
////        }
//
//    // Phương thức để lấy thông tin người dùng
//    public UserResponse getProfile(String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND + userId));
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//
//    // Phương thức để tìm tất cả người dùng
//    public List<UserResponse> getAllUser() {
//        List<User> users = userRepository.findAll();
//        return MapperUtil.mapObjectList(users, UserResponse.class);
//    }
//
//    // Phương thức để cập nhật trạng thái người dùng
//    public UserResponse updateUserStatus(String id, UserStatus status) {
//        User user = userRepository.findById(id).orElseThrow(() -> new ServiceException("User not found"));
//        user.setStatus(status);
//        user = userRepository.save(user);
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//
//    // Phương thức để active tài khoản người dùng
//    public UserResponse active(ActiveRequest request) {
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new NotFoundException("User not found " + request.getUserId()));
//        if (!"ysPlvePUPZjYj1gRFaW7".equals(request.getToken())) {
//            throw new ServiceException("Token không đúng hoặc đã hết hạn");
//        }
//        if (!UserStatus.WAITING_CONFIRM.equals(user.getStatus())) {
//            throw new ServiceException("Tài khoản đã được kích hoạt trước đó");
//        }
//
//        user.setStatus(UserStatus.ACTIVE);
//        user = userRepository.save(user);
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//
//    // Phương thức cho Admin cập nhật trạng thái người dùng
//    public String adminUpdateStatus(AdminUpdateStatusRequest request) {
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND + request.getUserId()));
//
//        if (UserStatus.WAITING_CONFIRM.equals(request.getStatus()) || UserStatus.WAITING_CONFIRM.equals(user.getStatus())) {
//            throw new ServiceException("Trạng thái không hợp lệ!");
//        }
//        if (user.getStatus().equals(request.getStatus())) {
//            throw new ServiceException("Trạng thái trùng với trạng thái hiện tại!");
//        }
//        user.setStatus(request.getStatus());
//        user = userRepository.save(user);
//        return user.getStatus().toString();
//    }
//
//
//    public Page<UserResponse> search(SearchRequest request) {
//        Specification<User> filterSpec = (root, query, criteriaBuilder)
//                -> criteriaBuilder.equal(criteriaBuilder.literal(1), criteriaBuilder.literal(1));
//
//        if (Objects.nonNull(request.getFilters()) && !request.getFilters().isEmpty()) {
//            for (FilterRequest filterReq : request.getFilters()) {
//                if (User_.STATUS.equalsIgnoreCase(filterReq.getField())) {
//                    filterSpec = filterSpec.and(DbUtil.createSpecification(filterReq));
//                }
//            }
//        }
//
//        // Đừng quên trả về một giá trị hợp lệ ở cuối phương thức
//        // Nếu bạn đang tìm kiếm, bạn có thể thêm một câu lệnh return ở đây
//        return userRepository.findAll(filterSpec, request.getPage().getPageable())
//                .map(user -> MapperUtil.mapObject(user, UserResponse.class));
//    }
//
//}



//    private final UserRepository userRepository;
//    private final BCryptPasswordEncoder passwordEncoder;
////    public User registerUser(User user) {
////        // Mã hóa mật khẩu
////        user.setPassword(passwordEncoder.encode(user.getPassword()));
////        return userRepository.save(user);
////    }
//private static final String TOKEN_ACTIVE = "ysPlvePUPZjYj1gRFaW7";
//    // Constructor Injection
//    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    public UserResponse createUser(SignupRequest request) {
//        log.info("Yêu cầu đăng ký: {}", request);
//        if (userRepository.existsByName(request.getName())) {
//            throw new ServiceException("Username already exists");
//        }
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new ServiceException("Email alreay exists");
//        }
//        User user = User.builder()
////                .username(request.getUsername())
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .phone(request.getPhone())
//                .status(UserStatus.WAITING_CONFIRM)
//                .build();
//        user = userRepository.save(user);
//        //VETIFI EMAIL
//        // Ánh xạ đối tượng user thành đối tượng UserResponse
//        UserResponse response = MapperUtil.mapObject(user, UserResponse.class);
//        return response; // Trả về đối tượng UserResponse
//    }
//
//
//    public UserResponse getProfile(String userId) {
//        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND + userId));
////Optional<User>userOpt =userRepository.findById(userId);
////if (!userOpt.isPresent()){
////    throw new NotFoundException("user not found "+userId);
////        }
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//
//    public List<UserResponse> getAllUser() {
//        List<User> users = userRepository.findAll();
//        return MapperUtil.mapObjectList(users, UserResponse.class);
//    }
//
//
//    public UserResponse updateUserStatus(String id, UserStatus status) {
//        User user = userRepository.findById(id).orElseThrow(() -> new ServiceException("User not found"));
//        user.setStatus(status);
//        user = userRepository.save(user);
//        return MapperUtil.mapObject(user, UserResponse.class);
//    }
//    public UserResponse active(ActiveRequest request){
//        User user=userRepository.findById(request.getUserId()).orElseThrow(()->new NotFoundException("user not found "+ request.getUserId()));
//    if(!TOKEN_ACTIVE.equals(request.getToken())){
//        throw new ServiceException("Token ko dung hoac da het han ");
//    }
//    if (UserStatus.WAITING_CONFIRM.equals(user.getStatus())){
//        throw  new ServiceException("user ko duoc kich hoat truoc do ");
//    }
//    //clean token
//        user.setStatus((UserStatus.ACTIVE));
//    user = userRepository.save(user);
//    return MapperUtil.mapObject(user,UserResponse.class);
//    }
//    public String adminUpdateStatus(AdminUpdateStatusRequest request){
//        User user = userRepository.findById(request.getUserId()).orElseThrow(()-> new NotFoundException(MessageError.USER_NOT_FOUND+ request.getUserId()));
//
//        if (UserStatus.WAITING_CONFIRM.equals(request.getStatus())|| UserStatus.WAITING_CONFIRM.equals(user.getStatus())) {
//            throw new ServiceException("Trang thai ko hop le !");
//
//        }
//        if(user.getStatus().equals(request.getStatus())){
//            throw new ServiceException("Trang thai trung voi trang thai cu !");
//
//        }
//        user.setStatus(request.getStatus());
//        user=userRepository.save(user);
//        return user.getStatus().toString();
//    }
//
//        public Page<UserResponse> search(SearchRequest request) {
//       var page = UserRepository.findAll(request.getPage().getPageable());
//       return page.map(user1 -> MapperUtil.mapObject(user1, UserResponse.class));
//    }
//
//
//    public Page<UserResponse> search(SearchRequest request) {
//            Specification<User> filterSpec = (root, query, criteriaBuilder)
//                    -> criteriaBuilder.equal(criteriaBuilder.literal(1), criteriaBuilder.literal (1));
//
//            if (Objects.nonNull(request.getFilters()) && !request.getFilters().isEmpty()) {
//
//                for (FilterRequest filterReq : request.getFilters()) {
//
//                    if (User_.STATUS.equalsIgnoreCase(filterReq.getField())) {
//                        filterSpec = filterSpec.and(DbUtil.createSpecification(filterReq));
//                    }
//                }
//
//if(StringUtils.hasText(request.getKeyword())){
//Specification<User> searchPec =DbUtil.createSpecification(FilterRequest.builder()
//        .field(User_.NAME)
//
//        .value(request.getKeyword())
//        .build());
//}
//                // select * from  // where 1=1 and
//
//                // and status = '"
//
//                // and
//                // and (name like or email like )
//            }
//
//        Page<User> page = userRepository.findAll(filterSpec,request.getPage().getPageable());
//        return MapperUtil.mapPage(page, UserResponse.class);
//    }

