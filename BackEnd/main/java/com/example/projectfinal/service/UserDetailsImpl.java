package com.example.projectfinal.service;

import com.example.projectfinal.Entity.Role;
import com.example.projectfinal.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    private final String id;
    private final String username;
    private final String password;
    private final List<GrantedAuthority> authorities;

    public UserDetailsImpl(User user) {
        this.id = user.getId();  // Lấy ID từ đối tượng User
        this.username = user.getEmail();  // Sử dụng email làm username
        this.password = user.getPassword();  // Mật khẩu đã được mã hóa
        this.authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
                .collect(Collectors.toList());
    }

    // Triển khai các phương thức của UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // Cập nhật trạng thái nếu cần thiết trong tương lai
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // Cập nhật trạng thái nếu cần thiết trong tương lai
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Cập nhật trạng thái nếu cần thiết trong tương lai
    }

    @Override
    public boolean isEnabled() {

        return true;

    }

    public String getId() {
        return id;
    }


}

//package com.example.projectfinal.service;
//
//import com.example.projectfinal.Entity.User;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import java.util.Collection;
//import java.util.List;
//import java.util.stream.Collectors;
//
//public class UserDetailsImpl implements UserDetails {
//
//    private String id;
//    private String username;
//    private String password;
//    private List<GrantedAuthority> authorities;
//
//    public UserDetailsImpl(User user) {
//        this.id = user.getId();  // Chuyển ID từ đối tượng User
//        this.username = user.getEmail();  // Sử dụng email làm username
//        this.password = user.getPassword();  // Mật khẩu đã mã hóa
//        this.authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
//                .collect(Collectors.toList());
//    }
//
//    // Triển khai các phương thức của UserDetails
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return authorities;
//    }
//
//    @Override
//    public String getPassword() {
//        return password;
//    }
//
//    @Override
//    public String getUsername() {
//        return username;
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//
//    public String getId() {
//        return id;
//    }
//}
