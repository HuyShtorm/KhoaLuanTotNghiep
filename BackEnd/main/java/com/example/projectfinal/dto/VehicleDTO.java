package com.example.projectfinal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VehicleDTO {
    private String id;
    private String licensePlate;
    private String type;
    private String frontImageUrl;
    private String sideImageUrl;
    private String rearImageUrl;
    private String userName;
    private String userEmail;


    public VehicleDTO(String string, String licensePlate, String name, String frontImageUrl, String sideImageUrl, String rearImageUrl, String name1, String name2, String email) {
    }
}
