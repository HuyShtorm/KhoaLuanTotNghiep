package com.example.projectfinal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceRegistrationDTO {
    private Integer serviceId;
    private String userName;
    private String licensePlate;
    private String gmail;
    // Constructor, getters, and setters
}
