package com.example.projectfinal.Entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Data
@Entity

@Table(name = "user_parking_services")
@IdClass(UserParkingServiceId.class) // Sử dụng composite key
public class UserParkingService {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "parking_service_id")
    private Integer parkingServiceId;

    @Id // Thêm annotation @Id để vehicleId là một phần của composite key
    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    @Column(name = "payment_due_date")
    private LocalDate paymentDueDate;
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "Chưa thanh toán"; // Trạng thái mặc định

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_service_id", insertable = false, updatable = false)
    private ParkingService parkingService;

    public ParkingService getParkingService() {
        return parkingService;
    }
}
