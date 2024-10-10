package com.example.projectfinal.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);  // Thêm logger

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String extractUsername(String token) {
        logger.info("Đang lấy tên đăng nhập từ token");
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        logger.info("Đang lấy thời gian hết hạn từ token");
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        logger.info("Đang lấy tất cả các claims từ token");
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        logger.info("Kiểm tra token có hết hạn hay không");
        return extractExpiration(token).before(new Date());
    }

//    public String generateToken(String username) {
//        logger.info("Đang tạo token cho tên đăng nhập: {}", username);
//        Map<String, Object> claims = new HashMap<>();
//        return createToken(claims, username);
//    }
public String generateToken(UserDetails userDetails) {
    logger.info("Đang tạo token cho tên đăng nhập: {}", userDetails.getUsername());

    // Lấy vai trò của người dùng và lưu vào claims
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList()));

    return createToken(claims, userDetails.getUsername());
}

//    private String createToken(Map<String, Object> claims, String subject) {
//        logger.info("Đang tạo token cho subject: {}", subject);
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(subject)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(SignatureAlgorithm.HS256, secret)
//                .compact();
//    }
private String createToken(Map<String, Object> claims, String subject) {
    logger.info("Đang tạo token cho subject: {}", subject);
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
}

    public Boolean validateToken(String token, String username) {
        logger.info("Đang xác thực token cho tên đăng nhập: {}", username);
        final String extractedUsername = extractUsername(token);
        boolean isValid = extractedUsername.equals(username) && !isTokenExpired(token);
        if (isValid) {
            logger.info("Token hợp lệ");
        } else {
            logger.warn("Token không hợp lệ hoặc đã hết hạn");
        }
        return isValid;
    }
    public List<String> extractRoles(String token) {
        logger.info("Đang trích xuất vai trò từ token");
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

}
