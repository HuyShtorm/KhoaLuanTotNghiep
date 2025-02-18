package com.example.projectfinal.Entity;

import com.example.projectfinal.enumStatic.VehicleType;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "parking_services")
public class ParkingService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false, length = 50)
    private String applicableType;

    @Column(nullable = false, length = 50)
    private String zone; // Ví dụ: Khu A, Khu B, Khu C

    @Column(nullable = false, length = 50)
    private String floor; // Ví dụ: Tầng 1, Tầng 2, Hầm B1
    @Column(nullable = false)
    private Boolean isOccupied = false;
    @Column(nullable = false)
    private Boolean isLocked = false;
    @Column(nullable = false)
    private Integer slotNumber; // Vị trí cụ thể (ví dụ: 01, 02, ...)

    @Column(columnDefinition = "TEXT")
    private String cameraUrl; // URL Camera giám sát
    @Column
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer durationMonths;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;
}
