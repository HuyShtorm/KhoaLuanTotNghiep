package com.example.projectfinal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AllVehicleDTO {
    private String id;
    private String licensePlate;
    private String type;
    private String frontImageUrl;
    private String sideImageUrl;
    private String rearImageUrl;
    private String status;

    // Constructor và getter/setter
}
