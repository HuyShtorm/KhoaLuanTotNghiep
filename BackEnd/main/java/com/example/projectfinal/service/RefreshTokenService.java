package com.example.projectfinal.service;

import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {
    // Lưu trữ và kiểm tra refresh tokens trong cơ sở dữ liệu

    public boolean isValid(String refreshToken) {
        // Kiểm tra refresh token từ database
        return true;
    }
}
