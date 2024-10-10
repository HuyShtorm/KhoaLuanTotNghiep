//package com.example.projectfinal.config;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.EnableTransactionManagement;
//
//import java.util.Date;
//
//@Component
//@EnableTransactionManagement
//@Log4j2
//public class JwtTokenProvider {
//
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    @Value("${jwt.expiration}")
//    private int jwtExpiration;
//
//    public String generateToken(Authentication authentication) {
//        log.info("Bắt đầu tạo JWT cho người dùng: {}", ((UserDetails) authentication.getPrincipal()).getUsername());  // Log khi tạo token
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        Date now = new Date();
//        Date expiryDate = new Date(now.getTime() + jwtExpiration);
//
//        String token = Jwts.builder()
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(now)
//                .setExpiration(expiryDate)
//                .signWith(SignatureAlgorithm.HS256, jwtSecret)
//                .compact();
//
//        log.info("JWT đã được tạo thành công cho người dùng: {}", userDetails.getUsername());  // Log sau khi tạo thành công
//        return token;
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            log.info("Bắt đầu xác thực JWT");  // Log trước khi xác thực token
//            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
//            log.info("JWT hợp lệ");  // Log nếu token hợp lệ
//            return true;
//        } catch (Exception e) {
//            log.error("JWT không hợp lệ: {}", e.getMessage());  // Log nếu token không hợp lệ
//            return false;
//        }
//    }
//}
//
