package com.example.projectfinal.repository;

import com.example.projectfinal.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> , JpaSpecificationExecutor<User> {
    boolean existsByName(String name);
    boolean existsByEmail(String email);
     User findByEmail(String email);
    List<User> findByNameContainingOrEmailContaining(String name, String email);

}




//package com.example.projectfinal.repository;
//
//import com.example.projectfinal.Entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
//
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
//    boolean existsByName(String name);
//    boolean existsByEmail(String email);
//
//    // Sửa phương thức này để trả về Optional<User>
//    Optional<User> findByEmail(String email);
//
//}
//
//
//
//
////package com.example.projectfinal.repository;
////
////import com.example.projectfinal.Entity.User;
////import org.springframework.data.jpa.repository.JpaRepository;
////import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
////import org.springframework.stereotype.Repository;
////
////import java.util.Optional;
////
////@Repository
////public interface UserRepository extends JpaRepository<User,String> , JpaSpecificationExecutor<User>  {
////    boolean existsByName(String name);
////    boolean existsByEmail(String email);
//////    Optional<User> findByEmail(String email);
//// User findByEmail(String email);
////
////}
