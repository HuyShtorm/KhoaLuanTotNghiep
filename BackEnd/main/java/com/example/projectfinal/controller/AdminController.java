package com.example.projectfinal.controller;

import com.example.projectfinal.Entity.ParkingService;
import com.example.projectfinal.Entity.User;
import com.example.projectfinal.Entity.UserParkingService;
import com.example.projectfinal.Entity.Vehicle;

import com.example.projectfinal.dto.AllVehicleDTO;
import com.example.projectfinal.dto.ServiceRegistrationDTO;
import com.example.projectfinal.dto.UserDTO;
import com.example.projectfinal.dto.VehicleDTO;
import com.example.projectfinal.enumStatic.VehicleStatus;
import com.example.projectfinal.repository.*;
import com.example.projectfinal.request.UpdateVehicleStatusRequest;
import com.example.projectfinal.request.user.AdminUpdateStatusRequest;
import com.example.projectfinal.request.user.UserRequest;
import com.example.projectfinal.response.user.UserResponse;
import com.example.projectfinal.service.ParkingServiceService;
import com.example.projectfinal.service.UserService;
import com.example.projectfinal.service.VehicleService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ParkingServiceService parkingServiceService;

    @Autowired
    private ParkingServiceRepository parkingServiceRepository;
    @Autowired
    private UserParkingServiceRepository userParkingServiceRepository;

    //    @Autowired
//    private HistoryRepository historyRepository;
    // Endpoint để lấy danh sách xe đang chờ duyệt
    @GetMapping("/pending-vehicles")
    public ResponseEntity<List<VehicleDTO>> getPendingVehicles() {
        List<Vehicle> pendingVehicles = vehicleService.getPendingVehicles();

        List<VehicleDTO> vehicleDTOs = pendingVehicles.stream()
                .map(vehicle -> new VehicleDTO(
                        vehicle.getId().toString(),
                        vehicle.getLicensePlate(),
                        vehicle.getType().name(),
                        vehicle.getFrontImageUrl(),
                        vehicle.getSideImageUrl(),
                        vehicle.getRearImageUrl(),
                        vehicle.getUser().getName(),    // Lấy tên khách hàng
                        vehicle.getUser().getEmail()   // Lấy email khách hàng
                ))
                .collect(Collectors.toList());

        log.info("Pending Vehicles: {}", vehicleDTOs);
        return ResponseEntity.ok(vehicleDTOs);
    }


    // Endpoint để cập nhật trạng thái của xe (xác nhận hoặc từ chối)
    @PostMapping("/approve-vehicle")
    public ResponseEntity<?> approveVehicle(@RequestBody UpdateVehicleStatusRequest request) {
        vehicleService.updateVehicleStatus(request.getVehicleId(), request.getStatus());
        return ResponseEntity.ok("Vehicle status updated.");
    }
    // 1. Lấy danh sách tất cả người dùng

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String search) {
        List<User> users = (search == null || search.isEmpty())
                ? userRepository.findAll()
                : userRepository.findByNameContainingOrEmailContaining(search, search);
        return ResponseEntity.ok(users);
    }


    // 2. Tìm kiếm người dùng theo tên hoặc email

    @GetMapping("/search-users")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        List<User> users = userRepository.findByNameContainingOrEmailContaining(keyword, keyword);
        return ResponseEntity.ok(users);
    }

    // 3. Xem thông tin chi tiết của một người dùng
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserDetails(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(userOptional.get());
    }


    // 4. Thêm mới người dùng


    // 5. Chỉnh sửa thông tin người dùng
    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        User user = userOptional.get();
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        // Cập nhật trạng thái nếu có
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }


    // 6. Xóa người dùng

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(404).body("Người dùng không tồn tại.");
        }
        userRepository.deleteById(userId);
        return ResponseEntity.ok("Người dùng đã được xóa.");
    }

    //     7. Lấy danh sách xe của một người dùng
    @GetMapping("/users/{userId}/vehicles")
    public ResponseEntity<List<AllVehicleDTO>> getVehiclesByUser(@PathVariable String userId) {
        List<Vehicle> vehicles = vehicleRepository.findByUserId(userId);
        List<AllVehicleDTO> vehicleDTOs = vehicles.stream()
                .map(vehicle -> new AllVehicleDTO(
                        vehicle.getId().toString(),
                        vehicle.getLicensePlate(),
                        vehicle.getType().name(),
                        vehicle.getFrontImageUrl(),
                        vehicle.getSideImageUrl(),
                        vehicle.getRearImageUrl(),

                        vehicle.getStatus().name()


                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicleDTOs);
    }


    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(@RequestParam(required = false) String status) {
        List<Vehicle> vehicles;
        if (status == null || status.isEmpty()) {
            vehicles = vehicleRepository.findAll();
        } else {
            VehicleStatus vehicleStatus = VehicleStatus.valueOf(status.toUpperCase());
            vehicles = vehicleRepository.findByStatus(vehicleStatus);
        }
        return ResponseEntity.ok(vehicles);
    }


    // Endpoint để lấy danh sách tất cả người dùng
    // Nếu phương thức đã có endpoint /users

    @PostMapping("/add-parking-service")
    public ResponseEntity<ParkingService> addParkingService(@RequestBody ParkingService parkingService) {
        return ResponseEntity.ok(parkingServiceService.addParkingService(parkingService));
    }

    @GetMapping("/parking-services")
    public ResponseEntity<List<ParkingService>> getAllServices() {
        return ResponseEntity.ok(parkingServiceService.getAllParkingServices());
    }


    @GetMapping("/available-slots")
    public ResponseEntity<List<Integer>> getAvailableSlots(
            @RequestParam String zone,
            @RequestParam String floor,
            @RequestParam int totalSlots) {
        List<Integer> availableSlots = parkingServiceService.getAvailableSlots(zone, floor, totalSlots);
        return ResponseEntity.ok(availableSlots);
    }

    @GetMapping("/service-registrations")
    public ResponseEntity<List<ServiceRegistrationDTO>> getServiceRegistrations() {
        List<ServiceRegistrationDTO> registrations = parkingServiceService.getAllServiceRegistrations();
        return ResponseEntity.ok(registrations);
    }


    @GetMapping("/released-services")
    public ResponseEntity<List<ParkingService>> getReleasedServices() {
        List<ParkingService> releasedServices = parkingServiceRepository.findReleasedServices();
        return ResponseEntity.ok(releasedServices);
    }

    @GetMapping("/invoices")
    public ResponseEntity<Map<String, Object>> getAdminInvoices() {
        // Lấy tất cả dịch vụ đã đăng ký
        List<UserParkingService> registeredServices = userParkingServiceRepository.findAll();

        // Map dữ liệu dịch vụ theo user
        Map<String, List<Map<String, Object>>> userInvoices = registeredServices.stream().collect(Collectors.groupingBy(
                service -> {
                    User user = userRepository.findById(service.getUserId()).orElse(null);
                    return user != null ? user.getEmail() : "Không xác định";
                },
                Collectors.mapping(service -> {
                    Map<String, Object> map = new HashMap<>();
                    ParkingService parkingService = parkingServiceRepository.findById(service.getParkingServiceId()).orElse(null);
                    if (parkingService != null) {
                        map.put("serviceName", parkingService.getName());
                        map.put("price", parkingService.getPrice());
                    }
                    map.put("startDate", service.getStartDate());
                    map.put("endDate", service.getEndDate());
                    map.put("paymentStatus", service.getPaymentStatus());
                    map.put("paymentDate", service.getPaymentDate());
                    return map;
                }, Collectors.toList())
        ));

        // Tính tổng tiền của từng user
        Map<String, BigDecimal> userTotals = new HashMap<>();
        userInvoices.forEach((email, services) -> {
            BigDecimal total = services.stream()
                    .filter(service -> service.get("price") != null)
                    .map(service -> (BigDecimal) service.get("price"))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            userTotals.put(email, total);
        });

        // Tính tổng tiền toàn hệ thống
        BigDecimal totalSystemAmount = userTotals.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Chuẩn bị dữ liệu trả về
        Map<String, Object> response = new HashMap<>();
        response.put("userInvoices", userInvoices);
        response.put("userTotals", userTotals);
        response.put("totalSystemAmount", totalSystemAmount);

        return ResponseEntity.ok(response);
    }
}

