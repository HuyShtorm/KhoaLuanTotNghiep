package com.example.projectfinal.controller;

import com.example.projectfinal.Entity.User;
import com.example.projectfinal.request.user.LoginRequest;
import com.example.projectfinal.request.user.SignupRequest;
import com.example.projectfinal.response.JwtResponse;
import com.example.projectfinal.service.AuthService;
import com.example.projectfinal.service.OtpService;
import com.example.projectfinal.service.UserDetailsImpl;
import com.example.projectfinal.service.UserService;
import com.example.projectfinal.util.JwtUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@ResponseBody
@RestController
@Configuration
@RequestMapping("/api/auth")


public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;



    @Autowired
    private AuthService authService;
    @Transactional
@PostMapping("/register")
public ResponseEntity<String> signup(@RequestBody @Valid SignupRequest request) {
    try {
        userService.registerUser(request); // Kiểm tra service này có vấn đề không
        return ResponseEntity.ok("Đăng ký thành công, OTP đã được gửi tới email của bạn.");
    } catch (ResponseStatusException e) {
        // Nếu gặp lỗi liên quan đến email đã tồn tại, trả về lỗi 400
        log.error("Email đã tồn tại: {}", e.getReason());
        return ResponseEntity.status(e.getStatus()).body(e.getReason());
    } catch (Exception e) {
        // Bắt ngoại lệ tổng quát và trả về lỗi 500 nếu có lỗi không xác định
        log.error("Error during signup process: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    }
}

    @Transactional

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        String otpCode = otpRequest.get("otp");

        boolean isValid = otpService.verifyOtp(email, otpCode);

        if (isValid) {
            userService.activateUser(email);
            return ResponseEntity.ok("Xác thực thành công, tài khoản đã được kích hoạt.");
        } else {
            log.error("OTP không hợp lệ hoặc đã hết hạn cho email: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP không hợp lệ hoặc đã hết hạn.");
        }
    }
    @Transactional
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        try {
            otpService.generateAndSendOtp(email);  // Gọi lại service để tạo và gửi mã OTP mới
            return ResponseEntity.ok("OTP mới đã được gửi lại tới email của bạn.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể gửi lại OTP, vui lòng thử lại.");
        }
    }

//    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
//        log.info("Bắt đầu xác thực người dùng với email: {}", loginRequest.getEmail());
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getEmail(),
//                            loginRequest.getPassword()
//                    )
//            );
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            String jwt = tokenProvider.generateToken(authentication);
//
//            log.info("Đăng nhập thành công cho người dùng: {}", loginRequest.getEmail());
//            return ResponseEntity.ok(new JwtResponse(jwt, "Đăng nhập thành công"));
//        } catch (BadCredentialsException e) {
//            log.error("Lỗi xác thực: Sai tài khoản hoặc mật khẩu cho email: {}", loginRequest.getEmail());
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản hoặc mật khẩu không chính xác.");
//        } catch (Exception e) {
//            log.error("Lỗi không xác định khi đăng nhập cho email: {}", loginRequest.getEmail(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã có lỗi xảy ra trong quá trình xác thực.");
//        }
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody User user) {
//        return authService.login(user);
//    }
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    log.info("Bắt đầu quá trình xác thực người dùng với email: {}", loginRequest.getEmail());
    try{
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);

    // Sử dụng UserDetailsImpl thay vì User
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    // Tạo JWT token
    String jwt = jwtUtil.generateToken(userDetails);
    log.info("Đăng nhập thành công cho người dùng: {}", loginRequest.getEmail());
    log.info("JWT token đã được tạo thành công cho người dùng: {}", loginRequest.getEmail());
    List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
} catch (BadCredentialsException e) {
        log.error("Lỗi xác thực: Sai tài khoản hoặc mật khẩu cho email: {}", loginRequest.getEmail());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản hoặc mật khẩu không chính xác.");
    } catch (Exception e) {
        log.error("Lỗi không xác định khi đăng nhập cho email: {}", loginRequest.getEmail(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã có lỗi xảy ra trong quá trình xác thực.");
    }
}








}

//package com.example.projectfinal.controller;
//
//import com.example.projectfinal.common.LoginRequest;
//import com.example.projectfinal.config.JwtTokenProvider;
//import com.example.projectfinal.request.user.SignupRequest;
//import com.example.projectfinal.response.JwtResponse;
//import com.example.projectfinal.response.WrapResponse;
//import com.example.projectfinal.response.user.UserResponse;
//import com.example.projectfinal.service.OtpService;
//import com.example.projectfinal.service.UserService;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.validation.Valid;
//import java.util.regex.Pattern;
//
//@RestController
//@Log4j2
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private JwtTokenProvider tokenProvider;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private OtpService otpService;
//
//    @PostMapping("/register")
//    public WrapResponse<UserResponse> signup(@RequestBody @Valid SignupRequest request) {
//        log.info("signup request :{}", request);
//
//        // Kiểm tra nếu số điện thoại bị thiếu
//        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
//            log.error("Đăng ký thất bại: Thiếu số điện thoại");
//            return WrapResponse.error("Số điện thoại không được để trống");
//        }
//
//        // Kiểm tra nếu email bị thiếu hoặc không đúng định dạng
//        if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
//            log.error("Đăng ký thất bại: Email không hợp lệ");
//            return WrapResponse.error("Email không hợp lệ");
//        }
//
//        // Kiểm tra nếu mật khẩu bị thiếu hoặc quá ngắn
//        if (request.getPassword() == null || request.getPassword().length() < 6) {
//            log.error("Đăng ký thất bại: Mật khẩu phải có ít nhất 6 ký tự");
//            return WrapResponse.error("Mật khẩu phải có ít nhất 6 ký tự");
//        }
//
//        // Xử lý tạo người dùng
//        try {
//            UserResponse userResponse = userService.createUser(request);
//            log.info("Đăng ký thành công cho người dùng: {}", request.getEmail());
//            return WrapResponse.ok(userResponse);
//        } catch (Exception e) {
//            log.error("Lỗi khi tạo người dùng: ", e);
//            return WrapResponse.error("Đã có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại.");
//        }
//    }
//
//    // Hàm kiểm tra định dạng email
//    private boolean isValidEmail(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
//        Pattern pattern = Pattern.compile(emailRegex);
//        return pattern.matcher(email).matches();
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getEmail(),
//                            loginRequest.getPassword()
//                    )
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            String jwt = tokenProvider.generateToken(authentication);
//
//            // Lấy vai trò của người dùng
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//            String role = userDetails.getAuthorities().iterator().next().getAuthority();
//
//            return ResponseEntity.ok(new JwtResponse(jwt, role));
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
//        }
//    }
//
//}
