//package com.example.projectfinal.Entity;


package com.example.projectfinal.Entity;

import com.example.projectfinal.enumStatic.UserStatus;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Column(name = "avatar_url",nullable = true)
    private String avatarUrl;
    @Column
    private String address;

    @Enumerated(EnumType.STRING)
    private UserStatus status;



    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();



    // Liên kết với phương tiện


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
                .collect(Collectors.toList());
    }

    @ManyToMany
    @JoinTable(
            name = "user_parking_services",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "parking_service_id")
    )
    private Set<ParkingService> parkingServices = new HashSet<>();
//    @ManyToMany
//    @JoinTable(
//            name = "user_parking_services",
//            joinColumns = @JoinColumn(name = "user_id"),
//            inverseJoinColumns = @JoinColumn(name = "parking_service_id")
//    )
//    private Set<ParkingService> parkingServices = new HashSet<>();





    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == UserStatus.ACTIVE;
    }
//    public void setServiceSelectedDate(LocalDate serviceSelectedDate) {
//        this.serviceSelectedDate = serviceSelectedDate;
//    }
//
//    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) {
//        this.subscriptionEndDate = subscriptionEndDate;
//    }
//
//    public void setIsSubscribed(boolean isSubscribed) {
//        this.isSubscribed = isSubscribed;
//    }
}


//
//import com.example.projectfinal.enumStatic.UserStatus;
//import lombok.*;
//import org.hibernate.annotations.GenericGenerator;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import javax.persistence.*;
//import java.util.Collection;
//import java.util.HashSet;
//import java.util.Set;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//
//@EqualsAndHashCode(callSuper = false)
//
//@Entity
//@Table(name = "users")
//public class User extends BaseEntity implements UserDetails {
//    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @GeneratedValue(generator = "uuid")
//    @GenericGenerator(name = "uuid",strategy ="uuid2")
//    private String id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(nullable = false, unique = true)
//    private String email;
//
//    @Column(nullable = false)
//    private String password;
//
//    @Column(nullable = false)
//    private String phone;
//    @Enumerated(EnumType.STRING)
//   private UserStatus status;
//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "user_roles",
//            joinColumns = @JoinColumn(name = "user_id"),
//            inverseJoinColumns = @JoinColumn(name = "role_id")
//    )
//
//
//    private Set<Role> roles = new HashSet<>();
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return roles.stream()
//                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public String getUsername() {
//        return this.email;  // sử dụng email làm tên đăng nhập
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
//        return this.status == UserStatus.ACTIVE;  // chỉ bật nếu người dùng đã kích hoạt tài khoản
//    }
//}
//
////@Table(name = "tb_user")
////public class User extends BaseEntity {
////    @Id
////    @GeneratedValue(generator = "uuid")
////    @GenericGenerator(name = "uuid",strategy ="uuid2")
////    private String id;
////    private String username;
////    private String password;
////    private String email;
////    private String phone;
////    private String name;
////    private String nameSearch;
////    private String avatar;
////    @Enumerated(EnumType.STRING)
////    private UserStatus status;
////
////}
