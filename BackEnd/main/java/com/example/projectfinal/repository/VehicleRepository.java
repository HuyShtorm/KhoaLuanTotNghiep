package com.example.projectfinal.repository;

import com.example.projectfinal.Entity.Vehicle;

import com.example.projectfinal.enumStatic.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByUserIdAndStatus(UUID userId, VehicleStatus status);
    List<Vehicle> findByUserIdAndStatus(String userId, VehicleStatus status); // Sử dụng String
    List<Vehicle> findByUserId(String userId);


    @Query("SELECT v FROM Vehicle v WHERE v.user.id = :userId AND v.status = :status")
    List<Vehicle> findApprovedVehiclesByUser(@Param("userId") String userId, @Param("status") VehicleStatus status);
    List<Vehicle> findByLicensePlate(String licensePlate);

}
