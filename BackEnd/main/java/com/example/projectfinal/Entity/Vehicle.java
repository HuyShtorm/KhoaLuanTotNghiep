package com.example.projectfinal.Entity;

import com.example.projectfinal.enumStatic.VehicleStatus;
import com.example.projectfinal.enumStatic.VehicleType;
import lombok.*;
import javax.persistence.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    private VehicleType type;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.PENDING; // mặc định là đang chờ duyệt

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Kiểu dữ liệu user trong Vehicle phù hợp với String id trong User

    private String frontImageUrl;
    private String sideImageUrl;
    private String rearImageUrl;
}
