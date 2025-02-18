package com.example.projectfinal.service;

import com.example.projectfinal.Entity.Vehicle;
import com.example.projectfinal.Entity.VehicleHistory;
import com.example.projectfinal.config.JwtUtil;

import com.example.projectfinal.dto.VehicleHistoryDTO;
import com.example.projectfinal.repository.UserRepository;
import com.example.projectfinal.repository.VehicleHistoryRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Log4j2
@Service
public class VehicleHistoryService {

    @Autowired
    private VehicleHistoryRepository vehicleHistoryRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;


    public VehicleHistory recordHistory(Vehicle vehicle, String action, String imageUrl) {
        VehicleHistory history = new VehicleHistory();
        history.setVehicle(vehicle);
        history.setImageUrl(imageUrl);
        if ("entry".equalsIgnoreCase(action)) {
            history.setTimeIn(LocalDateTime.now());
        } else if ("exit".equalsIgnoreCase(action)) {
            history.setTimeOut(LocalDateTime.now());
        }
        return vehicleHistoryRepository.save(history);
    }


    public void saveHistory(VehicleHistory history) {
        vehicleHistoryRepository.save(history);
    }
    public List<VehicleHistory> getAllHistory() {
        return vehicleHistoryRepository.findAll();
    }




}
