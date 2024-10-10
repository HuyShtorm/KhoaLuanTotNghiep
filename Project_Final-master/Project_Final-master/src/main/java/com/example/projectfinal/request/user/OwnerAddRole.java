package com.example.projectfinal.request.user;

import com.example.projectfinal.enumStatic.UserRole;
import lombok.Data;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
@Data
public class OwnerAddRole {
    @NotBlank(message = "roleId is required")
    private String roleId ;
    @NotNull
    private UserRole roleName;
}
