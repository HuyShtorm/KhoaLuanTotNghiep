package com.example.projectfinal.request.user;

import com.example.projectfinal.enumStatic.UserStatus;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class AdminUpdateStatusRequest {
    @NotBlank(message = "user is not blank")
    private String userId;
    @NotNull
    private UserStatus status;

}
