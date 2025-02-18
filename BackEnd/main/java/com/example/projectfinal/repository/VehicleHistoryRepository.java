package com.example.projectfinal.repository;

import com.example.projectfinal.Entity.VehicleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, UUID> {
    @Query("SELECT vh FROM VehicleHistory vh WHERE vh.user.id = :userId ORDER BY vh.timestamp DESC")
    List<VehicleHistory> findByUserId(@Param("userId") String userId);


}
