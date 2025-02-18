package com.example.projectfinal.request.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Setter
public class UserUpdateRequest {
    private String name;
    private String phone;
    private String oldPassword;
    private String newPassword;
    private MultipartFile avatar;
    private String address;

}
