package com.example.projectfinal.dto;

import com.example.projectfinal.Entity.VehicleHistory;
import lombok.Data;

import java.util.UUID;

@Data
public class VehicleHistoryDTO {

    private String licensePlate;
    private String action;
    private String timestamp;
    private String imageUrl;

    public VehicleHistoryDTO(VehicleHistory history) {

        this.licensePlate = history.getVehicle().getLicensePlate();
        this.action = history.getAction();
        this.timestamp = history.getTimestamp().toString();
        this.imageUrl = history.getImageUrl();
    }
}
