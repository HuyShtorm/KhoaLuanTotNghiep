package com.example.projectfinal.service;

import com.example.projectfinal.Entity.User;
import com.example.projectfinal.repository.UserRepository;
import com.example.projectfinal.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);  // Thêm logger

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;

    public ResponseEntity<?> register(User user) {
        logger.info("Đang đăng ký người dùng với email: {}", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        logger.info("Đăng ký người dùng thành công");
        return ResponseEntity.ok("Đăng ký thành công!");
    }

//    public ResponseEntity<?> login(User user) {
//        logger.info("Đang đăng nhập người dùng với email: {}", user.getEmail());
//        User existingUser = userRepository.findByEmail(user.getEmail());
//        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
//            String token = jwtUtil.generateToken(existingUser.getEmail());
//            logger.info("Đăng nhập thành công cho người dùng: {}", user.getEmail());
//            return ResponseEntity.ok(token);
//        } else {
//            logger.warn("Đăng nhập thất bại cho người dùng: {}", user.getEmail());
//            return ResponseEntity.status(401).body("Thông tin đăng nhập không chính xác");
//        }
//    }
public ResponseEntity<?> login(User user) {
    logger.info("Đang đăng nhập người dùng với email: {}", user.getEmail());

    User existingUser = userRepository.findByEmail(user.getEmail());

    if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {

        // Lấy UserDetails dựa trên email của người dùng
        UserDetails userDetails = userService.loadUserByUsername(existingUser.getEmail());

        // Tạo JWT token bằng cách sử dụng đối tượng UserDetails
        String token = jwtUtil.generateToken(userDetails);

        logger.info("Đăng nhập thành công cho người dùng: {}", user.getEmail());
        return ResponseEntity.ok(token);

    } else {
        logger.warn("Đăng nhập thất bại cho người dùng: {}", user.getEmail());
        return ResponseEntity.status(401).body("Thông tin đăng nhập không chính xác");
    }
}
    public ResponseEntity<?> verifyOtp(String otp, String email) {
        logger.info("Đang xác thực OTP cho email: {}", email);
        // Logic xác thực OTP
        logger.info("Xác thực OTP thành công cho email: {}", email);
        return ResponseEntity.ok("OTP xác thực thành công!");
    }

    public ResponseEntity<?> resendOtp(String email) {
        logger.info("Đang gửi lại OTP cho email: {}", email);
        // Logic gửi lại OTP
        logger.info("OTP đã được gửi lại thành công tới email: {}", email);
        return ResponseEntity.ok("OTP đã được gửi lại!");
    }
}
