package com.example.projectfinal.response.user;

import com.example.projectfinal.enumStatic.UserStatus;
import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String username;

    private String email;
private String phone;
private String name;
private String nameSearch;
private String avatar;
private UserStatus status;
}


