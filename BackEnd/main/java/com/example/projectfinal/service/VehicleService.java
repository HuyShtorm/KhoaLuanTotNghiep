package com.example.projectfinal.service;


import com.example.projectfinal.Entity.User;
import com.example.projectfinal.Entity.Vehicle;
import com.example.projectfinal.Entity.VehicleHistory;
import com.example.projectfinal.enumStatic.VehicleStatus;
import com.example.projectfinal.repository.VehicleRepository;
import com.example.projectfinal.request.AddVehicleRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private S3Service s3Service;
    @Autowired
    private VehicleHistoryService vehicleHistoryService;

    public Vehicle addVehicle(User user, AddVehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setType(request.getType());
        vehicle.setUser(user);

        // Upload images to S3
        vehicle.setFrontImageUrl(s3Service.uploadFile(request.getFrontImage()));
        vehicle.setSideImageUrl(s3Service.uploadFile(request.getSideImage()));
        vehicle.setRearImageUrl(s3Service.uploadFile(request.getRearImage()));

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicleStatus(String vehicleId, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(UUID.fromString(vehicleId))
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }
    public List<Vehicle> getPendingVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.PENDING);
    }

    public Vehicle updateVehicleStatus(UUID vehicleId, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }
    public List<Vehicle> getApprovedVehiclesByUser(String userId) {
        return vehicleRepository.findByUserIdAndStatus(userId, VehicleStatus.APPROVED);
    }


    public List<Vehicle> getVehiclesByUserId(String userId) {
        return vehicleRepository.findByUserIdAndStatus(userId, VehicleStatus.APPROVED);
    }

    public void deleteVehicle(String vehicleId) {
        vehicleRepository.deleteById(UUID.fromString(vehicleId));
    }

    public List<Vehicle> getAllVehiclesByUser(String userId) {
        return vehicleRepository.findByUserId(userId); // Lấy tất cả xe theo userId
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();  // Trả về tất cả xe
    }

    public List<Vehicle> getApprovedVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.APPROVED);
    }
    public void saveHistory(VehicleHistory history) {
        vehicleHistoryService.saveHistory(history);
    }


}
