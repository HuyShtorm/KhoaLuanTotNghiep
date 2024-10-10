package com.example.projectfinal.request.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ActiveRequest {
    @NotBlank(message = "userId is required")
    private String userId;

    @NotBlank(message = "token is required")
    private String token;

    // Thêm trường otp
    @NotBlank(message = "OTP is required")
    private String otp;
}
