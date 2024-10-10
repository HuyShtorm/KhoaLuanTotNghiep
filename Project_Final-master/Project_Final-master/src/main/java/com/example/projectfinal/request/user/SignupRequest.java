package com.example.projectfinal.request.user;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignupRequest {
//    @NotBlank(message = "user is require")
//    @Pattern(regexp = "^[a-zA-Z0-9-_]{6,50}",message = "user wrong format")
//    private String name;
//    private String password;
//    @NotBlank(message = "email is require")
//    private String email;
//    private String phone;
@NotBlank(message = "Tên không được để trống")
@Size(min = 10, max = 50, message = "Tên phải có từ 3 đến 50 ký tự")
private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.(com)$", message = "Email phải có đuôi .com")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(regexp = "^(?=.*[A-Z]).{8,}$", message = "Mật khẩu phải có ít nhất 1 chữ in hoa và dài tối thiểu 8 ký tự")
    private String password;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ, phải có 10-11 số.")
    private String phone;



}
