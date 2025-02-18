package com.example.projectfinal.request;


import com.example.projectfinal.enumStatic.VehicleStatus;
import lombok.Data;

@Data
public class UpdateVehicleStatusRequest {
    private String vehicleId;
    private VehicleStatus status;
}
