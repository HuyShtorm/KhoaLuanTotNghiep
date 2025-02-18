package com.example.projectfinal.controller;

import com.example.projectfinal.Entity.User;
import com.example.projectfinal.Entity.Vehicle;
import com.example.projectfinal.Entity.VehicleHistory;
import com.example.projectfinal.config.JwtUtil;

import com.example.projectfinal.dto.VehicleDTO;
import com.example.projectfinal.dto.VehicleDTOO;
import com.example.projectfinal.dto.VehicleHistoryDTO;
import com.example.projectfinal.repository.UserRepository;
import com.example.projectfinal.repository.VehicleHistoryRepository;
import com.example.projectfinal.repository.VehicleRepository;
import com.example.projectfinal.service.S3Service;
import com.example.projectfinal.service.VehicleHistoryService;
import com.example.projectfinal.service.VehicleService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Log4j2
@RestController
@RequestMapping("/api/vehicle-history")
public class VehicleHistoryController {

    @Autowired
    private VehicleHistoryService vehicleHistoryService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private S3Service s3Service;
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
@Autowired
private VehicleHistoryRepository vehicleHistoryRepository;


//    @PostMapping("/entry-exit")
//    public ResponseEntity<?> recordVehicleEntryExit(
//            @RequestParam UUID vehicleId, // Kiểm tra tham số này có khớp định dạng không
//            @RequestParam String action,
//            @RequestParam MultipartFile file
//    ) {
//        try {
//            if (vehicleId == null || action == null || file == null) {
//                return ResponseEntity.badRequest().body("Invalid data. Missing vehicleId, action, or file.");
//            }
//
//            // Tìm xe theo ID
//            Vehicle vehicle = vehicleRepository.findById(vehicleId)
//                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//
//            // Upload ảnh lên S3
//            String imageUrl = s3Service.uploadFile(file);
//
//            // Tạo lịch sử xe
//            VehicleHistory history = new VehicleHistory();
//            history.setVehicle(vehicle);
//            history.setAction(action);
//            history.setImageUrl(imageUrl);
//            history.setTimestamp(LocalDateTime.now());
//
//            // Lưu lịch sử vào database
//            vehicleHistoryService.saveHistory(history);
//
//            return ResponseEntity.ok("Lịch sử xe đã được ghi nhận.");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error recording vehicle history");
//        }
//    }

    @PostMapping("/entry-exit")
    public ResponseEntity<?> recordVehicleEntryExit(
            @RequestParam("vehicleId") UUID vehicleId,
            @RequestParam("action") String action,
            @RequestParam("file") MultipartFile file) {

        try {
            // Lấy xe từ vehicleId
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + vehicleId));

            // Lấy user từ xe
            User user = vehicle.getUser(); // Giả sử Vehicle đã ánh xạ với User

            // Upload file ảnh lên S3 (hoặc server)
            String imageUrl = s3Service.uploadFile(file);

            // Lưu lịch sử xe
            VehicleHistory history = new VehicleHistory();
            history.setVehicle(vehicle);
            history.setUser(user); // Gắn user vào lịch sử
            history.setAction(action); // entry hoặc exit
            history.setTimestamp(LocalDateTime.now());
            history.setImageUrl(imageUrl);

            vehicleHistoryService.saveHistory(history);

            return ResponseEntity.ok("Lịch sử xe được lưu thành công.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể lưu lịch sử xe.");
        }
    }






    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedVehicles() {
        try {
            // Lấy tất cả xe đã duyệt, không kiểm tra trùng lặp
            List<Vehicle> vehicles = vehicleService.getApprovedVehicles();

            // Tạo DTO để trả về các thông tin cần thiết
            List<VehicleDTOO> vehicleDTOs = vehicles.stream().map(vehicle -> {
                VehicleDTOO dto = new VehicleDTOO();
                dto.setId(String.valueOf(vehicle.getId()));
                dto.setLicensePlate(vehicle.getLicensePlate());
                dto.setType(vehicle.getType().toString());
                dto.setStatus(vehicle.getStatus().toString());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(vehicleDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching approved vehicles");
        }
    }
    @GetMapping("/entry-exit-history")
    public ResponseEntity<?> getVehicleEntryExitHistory() {
        try {
            List<VehicleHistory> historyList = vehicleHistoryService.getAllHistory();
            List<VehicleHistoryDTO> historyDTOs = historyList.stream()
                    .map(VehicleHistoryDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(historyDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching vehicle history");
        }
    }







    @GetMapping("/my-entry-exit-history")
    public ResponseEntity<?> getMyVehicleEntryExitHistory() {
        try {
            // Lấy email của user đang đăng nhập
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Lấy lịch sử ra vào xe của user
            List<VehicleHistory> historyList = vehicleHistoryRepository.findByUserId(user.getId());

            // Chuyển đổi sang DTO để trả về JSON đúng định dạng
            List<Map<String, Object>> response = historyList.stream().map(history -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", history.getId());
                map.put("licensePlate", history.getVehicle().getLicensePlate());
                map.put("action", history.getAction());
                map.put("timestamp", history.getTimestamp()); // Thời gian ra/vào
                map.put("imageUrl", history.getImageUrl());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching vehicle entry/exit history");
        }
    }








}
