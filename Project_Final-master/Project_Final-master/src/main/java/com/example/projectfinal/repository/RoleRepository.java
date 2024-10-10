package com.example.projectfinal.repository;


import com.example.projectfinal.Entity.Role;
import com.example.projectfinal.enumStatic.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
//    Optional<Role> findByRoleName(UserRole roleName);
    @Query("SELECT r FROM Role r WHERE r.roleName = ?1")
    Optional<Role> findByName(UserRole name);
}
