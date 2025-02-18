package com.example.projectfinal.dto;

import java.math.BigDecimal;

public class ParkingServiceDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String applicableType;
    private int durationMonths;
    private String description;
    private String zone;
    private String floor;
    private int slotNumber;
    private String cameraUrl;
    public ParkingServiceDTO(Long id, String name, BigDecimal price, String applicableType, int durationMonths, String description,String zone, String floor, int slotNumber, String cameraUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.applicableType = applicableType;
        this.durationMonths = durationMonths;
        this.description = description;
        this.zone = zone;
        this.floor = floor;
        this.slotNumber = slotNumber;
        this.cameraUrl = cameraUrl;
    }

    // Getters and Setters
}
