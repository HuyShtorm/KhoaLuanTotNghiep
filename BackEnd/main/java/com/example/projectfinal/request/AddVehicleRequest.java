package com.example.projectfinal.request;


import com.example.projectfinal.enumStatic.VehicleType;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AddVehicleRequest {
    private String licensePlate;
    private VehicleType type;
    private MultipartFile frontImage;
    private MultipartFile sideImage;
    private MultipartFile rearImage;
}
