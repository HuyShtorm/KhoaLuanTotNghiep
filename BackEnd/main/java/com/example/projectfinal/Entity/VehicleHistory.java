package com.example.projectfinal.Entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Getter
@Setter
public class VehicleHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String action; // "IN" hoặc "OUT"

    private LocalDateTime timestamp;

    private String imageUrl; // Đường dẫn ảnh lưu trên S3

    public void setTimeIn(LocalDateTime now) {
        this.timestamp = now;
    }

    public void setTimeOut(LocalDateTime now) {
        this.timestamp = now;
    }


}
