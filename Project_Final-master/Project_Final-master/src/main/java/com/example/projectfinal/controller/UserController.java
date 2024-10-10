package com.example.projectfinal.controller;

import com.example.projectfinal.enumStatic.UserStatus;
import com.example.projectfinal.request.SearchRequest;
import com.example.projectfinal.request.user.ActiveRequest;
import com.example.projectfinal.request.user.SignupRequest;
import com.example.projectfinal.response.WrapResponse;
import com.example.projectfinal.response.user.UserResponse;

import com.example.projectfinal.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@Log4j2
public class UserController {
    @Autowired
    private UserService userService;

//    @PostMapping("/register")
//    public WrapResponse<UserResponse> signup(@RequestBody @Valid SignupRequest request) {
//        log.info("signup request :{}", request);
//
//        return WrapResponse.ok(userService.createUser(request));
//    }
//@PostMapping("/register")
//public WrapResponse<UserResponse> signup(@RequestBody @Valid SignupRequest request) {
//    log.info("signup request :{}", request);
//
//    // Kiểm tra nếu số điện thoại bị thiếu
//    if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
//        log.error("Đăng ký thất bại: Thiếu số điện thoại");
//        return WrapResponse.error("Số điện thoại không được để trống");
//    }
//
//    // Kiểm tra nếu email bị thiếu hoặc không đúng định dạng
//    if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
//        log.error("Đăng ký thất bại: Email không hợp lệ");
//        return WrapResponse.error("Email không hợp lệ");
//    }
//
//    // Kiểm tra nếu mật khẩu bị thiếu hoặc quá ngắn
//    if (request.getPassword() == null || request.getPassword().length() < 6) {
//        log.error("Đăng ký thất bại: Mật khẩu phải có ít nhất 6 ký tự");
//        return WrapResponse.error("Mật khẩu phải có ít nhất 6 ký tự");
//    }
//
//    // Xử lý tạo người dùng
//    try {
//        UserResponse userResponse = userService.createUser(request);
//        log.info("Đăng ký thành công cho người dùng: {}", request.getEmail());
//        return WrapResponse.ok(userResponse);
//    } catch (Exception e) {
//        log.error("Lỗi khi tạo người dùng: ", e);
//        return WrapResponse.error("Đã có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại.");
//    }
//}
//
//    // Hàm kiểm tra định dạng email
//    private boolean isValidEmail(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
//        Pattern pattern = Pattern.compile(emailRegex);
//        return pattern.matcher(email).matches();
//    }






    @PostMapping("/profile/{userId}")
public  WrapResponse<UserResponse> getProfile(@PathVariable String userId){
    return WrapResponse.ok(userService.getProfile(userId));
}


//    @GetMapping("/{id}"){
//        public WrapResponse<UserResponse> getUser(@PathVariable String id){
//            log.info("Get user by id : {}",id);
//            return WrapResponse.ok(userService.getUser());
//        }
//    }

    @PostMapping("/active")
    public WrapResponse<UserResponse> active(@RequestBody @Valid ActiveRequest request) {
        // Gọi phương thức activeWithOtp từ UserService để xử lý việc kích hoạt
        return WrapResponse.ok(userService.activeWithOtp(request));
    }

    @PutMapping("/update-status/{id}")
    public WrapResponse<UserResponse> updateStatus(@PathVariable String id){
        log.info("Update status user by id :{}",id);
        return WrapResponse.ok(userService.updateUserStatus(id, UserStatus.ACTIVE));
    }

    @GetMapping("/all")
        public WrapResponse<List<UserResponse>> getAllUser(){
            log.info("Get all user");
            return WrapResponse.ok(userService.getAllUser());
        }





}
