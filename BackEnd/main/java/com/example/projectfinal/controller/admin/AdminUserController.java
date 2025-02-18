package com.example.projectfinal.controller.admin;

import com.example.projectfinal.request.SearchRequest;
import com.example.projectfinal.request.user.AdminUpdateStatusRequest;

import com.example.projectfinal.response.WrapResponse;
import com.example.projectfinal.response.user.UserResponse;
import com.example.projectfinal.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/admin")//user role admin
@Log4j2
public class AdminUserController {

    private final UserService userService;
    public AdminUserController(UserService userService){

        this.userService=userService;
    }

    @PostMapping("/update-status")
public WrapResponse<String> updateStatus(@Valid @RequestBody AdminUpdateStatusRequest request)
    {
return WrapResponse.ok(userService.adminUpdateStatus(request));
    }
    @PostMapping("/search")
    public WrapResponse<Page<UserResponse>> search(@RequestBody SearchRequest request) {
        log.info("Search user by id: {}", request);
        return WrapResponse.ok(userService.search(request));
    }
}
