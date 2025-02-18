package com.example.projectfinal.repository;

import com.example.projectfinal.Entity.ParkingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ParkingServiceRepository extends JpaRepository<ParkingService, Integer> {
    @Query("SELECT ps.slotNumber FROM ParkingService ps WHERE ps.zone = :zone AND ps.floor = :floor AND ps.isOccupied = true")
    List<Integer> findOccupiedSlots(@Param("zone") String zone, @Param("floor") String floor);

    @Query("SELECT ps FROM ParkingService ps WHERE ps.isLocked = false")
    List<ParkingService> findAllUnlockedServices();

    @Modifying
    @Transactional
    @Query("UPDATE ParkingService ps SET ps.isLocked = :isLocked WHERE ps.id = :serviceId")
    void updateServiceLockStatus(@Param("serviceId") Integer serviceId, @Param("isLocked") Boolean isLocked);

    @Query("SELECT ps FROM ParkingService ps WHERE ps.isLocked = false")
    List<ParkingService> findReleasedServices();
}

