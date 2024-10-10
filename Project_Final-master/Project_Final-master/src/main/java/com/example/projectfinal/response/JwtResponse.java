//package com.example.projectfinal.response;
//
//public class JwtResponse {
//    private String token;
//    private String role;
//
//    public JwtResponse(String token, String role) {
//        this.token = token;
//        this.role = role;
//    }
//
//    // Getters and setters
//}
package com.example.projectfinal.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, String id, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }
}
