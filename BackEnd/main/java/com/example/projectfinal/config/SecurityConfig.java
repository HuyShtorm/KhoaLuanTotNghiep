//package com.example.projectfinal.config;
package com.example.projectfinal.config;

import com.example.projectfinal.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Log4j2
@Configuration
public class SecurityConfig {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(@Lazy UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtRequestFilter jwtRequestFilter = new JwtRequestFilter(jwtUtil, userService);

        http
                .csrf().disable()
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(List.of("http://localhost:3000",  			"https://quanlixe.com","https://www.quanlixe.com","http://localhost:8081"));
                   config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    log.info("Cấu hình CORS được thiết lập");
                    return config;
                }))
                .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/chat").permitAll()


                .antMatchers("/api/users/profile").authenticated()
                .antMatchers("/api/admin/**").authenticated()
                .antMatchers("/api/users/**").authenticated()

                .antMatchers("/api/vehicle-history/**").authenticated() // Cần xác thực
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user/**").hasRole("USER")
                .antMatchers("/owner/**").hasRole("OWNER")
                .antMatchers("/moderator/**").hasRole("MODERATOR")
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        log.info("Security Filter Chain được cấu hình thành công");
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }
}

//
//import com.example.projectfinal.service.UserService;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//
//import java.util.List;
//
//@Log4j2
//@Configuration
//public class SecurityConfig {
//
//    private final UserService userService;
//
//    public SecurityConfig(@Lazy UserService userService) {
//        this.userService = userService;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf().disable()
//                .cors(cors -> cors.configurationSource(request -> {
//                    CorsConfiguration config = new CorsConfiguration();
//                    // Cho phép truy cập từ frontend trên localhost:3000
//                    config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
//                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                    config.setAllowedHeaders(List.of("*"));
//                    config.setAllowCredentials(true);  // Cho phép xác thực qua cookies hoặc token
//                    log.info("Cấu hình CORS được thiết lập");
//                    return config;
//                }))
//                .authorizeRequests()
//                // Các endpoint được phép truy cập không cần xác thực
//                .antMatchers("/api/auth/**").permitAll()
//                // Chỉ cho phép USER hoặc ADMIN thêm phương tiện
//                // Các quyền riêng biệt cho từng vai trò
//                .antMatchers("/api/users/profile").authenticated()
//                .antMatchers("/admin/**").hasRole("ADMIN")
//                .antMatchers("/user/**").hasRole("USER")
//                .antMatchers("/owner/**").hasRole("OWNER")
//                .antMatchers("/moderator/**").hasRole("MODERATOR")
//                // Các endpoint còn lại yêu cầu phải đăng nhập
//                .anyRequest().authenticated()
//                .and()
//                // Đặt SessionManagement thành Stateless để dùng JWT
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//
//        log.info("Security Filter Chain được cấu hình thành công");
//        return http.build();
//    }
//
//    @Bean
//    public BCryptPasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//        return http.getSharedObject(AuthenticationManagerBuilder.class)
//                .userDetailsService(userService)
//                .passwordEncoder(passwordEncoder())
//                .and()
//                .build();
//    }
//}
