package com.example.projectfinal.controller;


import com.example.projectfinal.Entity.*;
import com.example.projectfinal.config.JwtUtil;
import com.example.projectfinal.dto.ParkingServiceDTO;
import com.example.projectfinal.dto.VehicleDTO;

import com.example.projectfinal.repository.*;
import com.example.projectfinal.request.AddVehicleRequest;
import com.example.projectfinal.request.user.UserUpdateRequest;
import com.example.projectfinal.request.user.VerifyOtpRequest;

import com.example.projectfinal.service.ParkingServiceService;
import com.example.projectfinal.service.UserService;
import com.example.projectfinal.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleService vehicleService;
 // Import lớp ParkingServiceRepository
    @Autowired
 private ParkingServiceRepository parkingServiceRepository;
 @Autowired
 private ParkingServiceService parkingServiceService;
 @Autowired
 private UserParkingServiceRepository userParkingServiceRepository;
 @Autowired
 private VehicleRepository vehicleRepository;
// @Autowired
// private HistoryRepository historyRepository;
    // API để lấy thông tin người dùng dựa trên token
    @GetMapping("/me")
    public ResponseEntity<User> getUserInfo(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            User user = userService.getUserByEmail(email);
            if (user == null) {
                throw new UsernameNotFoundException("Người dùng không tồn tại.");
            }
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(401).build(); // Unauthorized nếu không có token
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@ModelAttribute UserUpdateRequest updateRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            User updatedUser = userService.updateUser(updateRequest, username);
            return ResponseEntity.ok().body(updatedUser.getAvatarUrl()); // Trả về URL avatar

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật thông tin người dùng");
        }
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        try {
            User user = userService.confirmEmailChange(
                    verifyOtpRequest.getOldEmail(),
                    verifyOtpRequest.getNewEmail(),
                    verifyOtpRequest.getOtp());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping("/add-vehicle")
    public ResponseEntity<?> addVehicle(Principal principal, @ModelAttribute AddVehicleRequest request) {
        User user = userService.getUserByEmail(principal.getName());
        vehicleService.addVehicle(user, request);
        return ResponseEntity.ok("Vehicle added and awaiting admin approval.");
    }
    @GetMapping("/approved-vehicles")
    public ResponseEntity<List<Vehicle>> getApprovedVehicles(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        String userId = user.getId();  // ID dạng String
        List<Vehicle> approvedVehicles = vehicleService.getApprovedVehiclesByUser(userId);
        return ResponseEntity.ok(approvedVehicles);
    }

//    @PutMapping("/update-avatar")
//    public ResponseEntity<?> updateUser(
//            @RequestPart("user") UserUpdateRequest updateRequest,
//            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
//            Principal principal
//    ) {
//        try {
//            User updatedUser = userService.updateUser(updateRequest, avatar, principal.getName());
//            return ResponseEntity.ok(updatedUser);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        String userId = user.getId(); // Lấy ID của người dùng đang đăng nhập

        List<Vehicle> allVehicles = vehicleService.getAllVehiclesByUser(userId);
        return ResponseEntity.ok(allVehicles);
    }

    @GetMapping("/all-vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<Vehicle> allVehicles = vehicleService.getAllVehicles();

        List<VehicleDTO> vehicleDTOs = allVehicles.stream()
                .map(vehicle -> new VehicleDTO(
                        vehicle.getId().toString(),
                        vehicle.getLicensePlate(),
                        vehicle.getType().name(),
                        vehicle.getFrontImageUrl(),
                        vehicle.getSideImageUrl(),
                        vehicle.getRearImageUrl(),
                        vehicle.getStatus().name(),
                        vehicle.getUser().getName(),
                        vehicle.getUser().getEmail()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDTOs);
    }
//    @PostMapping("/subscribe-service/{serviceId}")
//    public ResponseEntity<?> subscribeService(@PathVariable Long serviceId, Principal principal) {
//        // Lấy email từ Principal
//        String email = principal.getName();
//
//        // Lấy thông tin User dựa trên email
//        User user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new RuntimeException("User not found for email: " + email);
//        }
//
//        parkingServiceService.assignServiceToUser(user.getId(), serviceId, 1); // 1 là số tháng mặc định
//        return ResponseEntity.ok("Subscribed successfully");
//    }





//    @PostMapping("/subscribe-service/{serviceId}")
//    public ResponseEntity<String> subscribeService(@PathVariable Integer serviceId, Principal principal) {
//        // Lấy thông tin email của user từ token
//        String email = principal.getName();
//
//        // Gọi service để thêm dịch vụ cho user
//        userService.addServiceToUser(email, serviceId);
//
//        return ResponseEntity.ok("Service subscribed successfully!");
//    }


//    @PostMapping("/subscribe-service/{serviceId}")
//    public ResponseEntity<String> subscribeService(
//            @PathVariable Integer serviceId,
//            @RequestParam String vehicleId,
//            Principal principal) {
//        String email = principal.getName();
//        userService.addServiceToUser(email, serviceId, vehicleId);
//        return ResponseEntity.ok("Service subscribed successfully!");
//    }
//@PostMapping("/subscribe-service/{serviceId}")
//public ResponseEntity<?> subscribeService(
//        @PathVariable Integer serviceId,
//        @RequestParam String vehicleId,
//        Principal principal) {
//
//    // Lấy email từ Principal và thông tin user
//    String email = principal.getName();
//    User user = userService.getUserByEmail(email);
//    if (user == null) {
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại.");
//    }
//
//    UUID vehicleUUID = UUID.fromString(vehicleId);
//
//    // Kiểm tra nếu dịch vụ đã được đăng ký bởi xe khác
//    if (userParkingServiceRepository.existsByParkingServiceId(serviceId)) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body("Dịch vụ này đã được đăng ký bởi xe khác.");
//    }
//    if (userParkingServiceRepository.existsByVehicleId(vehicleUUID)) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body("Xe này đã đăng ký một dịch vụ khác.");
//    }
//    if (userParkingServiceRepository.existsByVehicleIdAndParkingServiceId(vehicleUUID, serviceId)) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body("Xe này đã đăng ký dịch vụ này rồi.");
//    }
//    System.out.println("Check serviceId exists: " + userParkingServiceRepository.existsByParkingServiceId(serviceId));
//    System.out.println("Check vehicleId exists: " + userParkingServiceRepository.existsByVehicleId(vehicleUUID));
//    System.out.println("Check specific service: " + userParkingServiceRepository.existsByVehicleIdAndParkingServiceId(vehicleUUID, serviceId));
//
//    // Tạo mới đăng ký dịch vụ
//    UserParkingService newRegistration = new UserParkingService();
//    newRegistration.setUserId(user.getId());
//    newRegistration.setParkingServiceId(serviceId);
//    newRegistration.setVehicleId(vehicleUUID);
//    newRegistration.setStartDate(LocalDate.now());
//    newRegistration.setEndDate(LocalDate.now().plusMonths(1)); // Giả sử thời hạn là 1 tháng
//
//    userParkingServiceRepository.save(newRegistration);
//
//    return ResponseEntity.ok("Đăng ký dịch vụ thành công.");
//}
@PostMapping("/subscribe-service/{serviceId}")
public ResponseEntity<?> subscribeService(
        @PathVariable Integer serviceId,
        @RequestParam String vehicleId,
        Principal principal) {

    // Lấy email từ Principal và thông tin user
    String email = principal.getName();
    User user = userService.getUserByEmail(email);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại.");
    }

    UUID vehicleUUID = UUID.fromString(vehicleId);

    // Kiểm tra nếu dịch vụ đã được đăng ký bởi xe khác
    if (userParkingServiceRepository.existsByParkingServiceId(serviceId)) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Dịch vụ này đã được đăng ký bởi xe khác.");
    }
    if (userParkingServiceRepository.existsByVehicleId(vehicleUUID)) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Xe này đã đăng ký một dịch vụ khác.");
    }
    if (userParkingServiceRepository.existsByVehicleIdAndParkingServiceId(vehicleUUID, serviceId)) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Xe này đã đăng ký dịch vụ này rồi.");
    }

    // Tạo mới đăng ký dịch vụ
    UserParkingService newRegistration = new UserParkingService();
    newRegistration.setUserId(user.getId());
    newRegistration.setParkingServiceId(serviceId);
    newRegistration.setVehicleId(vehicleUUID);
    newRegistration.setStartDate(LocalDate.now());
    newRegistration.setEndDate(LocalDate.now().plusMonths(1)); // Giả sử thời hạn là 1 tháng
newRegistration.setPaymentDueDate(LocalDate.now().plusDays(7));
newRegistration.setPaymentStatus("chưa thanh toán");
    userParkingServiceRepository.save(newRegistration);

    // Cập nhật trạng thái isLocked của dịch vụ
    parkingServiceService.lockService(serviceId);

    return ResponseEntity.ok("Đăng ký dịch vụ thành công.");
}


    @GetMapping("/parking-services")
    public ResponseEntity<List<ParkingService>> getAllServices() {
        return ResponseEntity.ok(parkingServiceService.getAllParkingServices());

    }
    @GetMapping("/overdue-payment-services")
    public ResponseEntity<List<Map<String, Object>>> getOverduePaymentServices(Principal principal) {
        String userId = principal.getName();
        List<UserParkingService> overdueServices = parkingServiceService.getOverduePaymentServices(userId);

        List<Map<String, Object>> response = overdueServices.stream().map(service -> {
            Map<String, Object> map = new HashMap<>();
            map.put("parkingServiceId", service.getParkingServiceId());
            map.put("vehicleId", service.getVehicleId());
            map.put("startDate", service.getStartDate());
            map.put("endDate", service.getEndDate());
            map.put("paymentDueDate", service.getPaymentDueDate());
            map.put("paymentStatus", service.getPaymentStatus());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/registered-services")
    public ResponseEntity<List<Map<String, Object>>> getRegisteredServices(Principal principal) {
        String userId = principal.getName(); // Lấy userId từ principal
        List<UserParkingService> registeredServices = parkingServiceService.getRegisteredServicesByUser(userId);

        List<Map<String, Object>> response = registeredServices.stream().map(service -> {
            Map<String, Object> map = new HashMap<>();
            ParkingService parkingService = parkingServiceRepository.findById(service.getParkingServiceId())
                    .orElse(null);
            Vehicle vehicle = vehicleRepository.findById(service.getVehicleId()).orElse(null);

            map.put("parkingServiceId", service.getParkingServiceId());
            map.put("vehicleId", service.getVehicleId());
            map.put("startDate", service.getStartDate());
            map.put("endDate", service.getEndDate());
            map.put("paymentStatus", service.getPaymentStatus());
            map.put("paymentDueDate", service.getPaymentDueDate());

            if (parkingService != null) {
                map.put("serviceName", parkingService.getName());
                map.put("price", parkingService.getPrice());
                map.put("zone", parkingService.getZone());
                map.put("floor", parkingService.getFloor());
                map.put("slotNumber", parkingService.getSlotNumber());
            }

            if (vehicle != null) {
                map.put("licensePlate", vehicle.getLicensePlate());
                map.put("vehicleType", vehicle.getType());
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }





//    @GetMapping("/registered-services")
//    public ResponseEntity<List<UserParkingService>> getRegisteredServices(Principal principal) {
//        String userId = principal.getName(); // Assuming userId được dùng làm username
//        List<UserParkingService> registeredServices = parkingServiceService.getRegisteredServicesByUser(userId);
//        return ResponseEntity.ok(registeredServices);
//    }


    @GetMapping("/available")
    public ResponseEntity<List<ParkingService>> getAvailableServices() {
        return ResponseEntity.ok(parkingServiceService.getAvailableServices());
    }

    @PostMapping("/lock/{serviceId}")
    public ResponseEntity<String> lockService(@PathVariable Integer serviceId) {
        parkingServiceService.lockService(serviceId);
        return ResponseEntity.ok("Dịch vụ đã được khóa.");
    }

    @PostMapping("/unlock/{serviceId}")
    public ResponseEntity<String> unlockService(@PathVariable Integer serviceId) {
        parkingServiceService.unlockService(serviceId);
        return ResponseEntity.ok("Dịch vụ đã được mở khóa.");
    }





    @GetMapping("/expired-services")
    public ResponseEntity<List<UserParkingService>> getExpiredServices(Principal principal) {
        String userId = principal.getName();
        List<UserParkingService> expiredServices = userParkingServiceRepository.findExpiredServicesByUser(userId);
        return ResponseEntity.ok(expiredServices);
    }



    @GetMapping("/invoice")
    public ResponseEntity<Map<String, Object>> getUserInvoice(Principal principal) {
        // Lấy email từ Principal
        String email = principal.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Người dùng không tồn tại"));
        }

        // Lấy danh sách dịch vụ đã đăng ký từ `user_parking_services`
        List<UserParkingService> registeredServices = userParkingServiceRepository.findAllByUserId(user.getId());

        // Kiểm tra nếu không có dịch vụ nào
        if (registeredServices.isEmpty()) {
            return ResponseEntity.ok(Map.of("services", List.of(), "totalAmount", BigDecimal.ZERO));
        }

        // Map thông tin dịch vụ từ bảng `parking_services`
        // Map thông tin dịch vụ từ bảng `parking_services`
        List<Map<String, Object>> services = registeredServices.stream()
                .map(service -> {
                    Map<String, Object> map = new HashMap<>();
                    ParkingService parkingService = parkingServiceRepository.findById(service.getParkingServiceId()).orElse(null);
                    Vehicle vehicle = vehicleRepository.findById(service.getVehicleId()).orElse(null); // Lấy thông tin xe
                    if (parkingService != null) {
                        map.put("parkingServiceId", service.getParkingServiceId());
                        map.put("serviceName", parkingService.getName());
                        map.put("price", parkingService.getPrice());

                    }
                    if (vehicle != null) {
                        map.put("licensePlate", vehicle.getLicensePlate()); // Thêm biển số xe
                    }
                    map.put("startDate", service.getStartDate());
                    map.put("endDate", service.getEndDate());
                    map.put("paymentStatus", service.getPaymentStatus());


                    map.put("paymentDueDate", service.getPaymentDueDate()); // Thêm ngày hết hạn thanh toán
                    map.put("paymentDate", service.getPaymentDate());
                    return map;
                }).collect(Collectors.toList());

        // Tính tổng tiền
        BigDecimal totalAmount = services.stream()
                .filter(service -> service.containsKey("price") && service.get("price") != null)
                .map(service -> (BigDecimal) service.get("price"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Chuẩn bị dữ liệu trả về
        Map<String, Object> response = new HashMap<>();
        response.put("services", services);
        response.put("totalAmount", totalAmount);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/mock-payment")
    public ResponseEntity<?> mockPayment(@RequestBody Map<String, Object> request, Principal principal) {
        // Lấy thông tin người dùng hiện tại
        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại.");
        }

        // Lấy danh sách serviceIds và phương thức thanh toán từ request
        List<Integer> serviceIds = (List<Integer>) request.get("serviceIds");
        String paymentMethod = (String) request.get("paymentMethod");

        if (serviceIds == null || serviceIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách dịch vụ rỗng.");
        }

        // Lấy danh sách dịch vụ cần thanh toán
        List<UserParkingService> servicesToPay = userParkingServiceRepository.findAllByUserId(user.getId()).stream()
                .filter(service -> serviceIds.contains(service.getParkingServiceId()) &&
                        "chưa thanh toán".equalsIgnoreCase(service.getPaymentStatus()))
                .collect(Collectors.toList());

        if (servicesToPay.isEmpty()) {
            return ResponseEntity.badRequest().body("Không có dịch vụ nào hợp lệ để thanh toán.");
        }

        // Giả lập thanh toán
        BigDecimal totalAmount = servicesToPay.stream()
                .map(service -> service.getParkingService().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Cập nhật trạng thái dịch vụ và ngày thanh toán
        LocalDate paymentDate = LocalDate.now();
        servicesToPay.forEach(service -> {
            service.setPaymentStatus("Đã thanh toán");
            service.setPaymentDate(paymentDate);
            userParkingServiceRepository.save(service);
        });

        return ResponseEntity.ok(Map.of(
                "message", "Thanh toán thành công",
                "totalAmount", totalAmount,
                "paymentDate", paymentDate
        ));
    }



    @GetMapping("/paid-services")
    public ResponseEntity<List<Map<String, Object>>> getPaidServices(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }

        List<UserParkingService> paidServices = userParkingServiceRepository.findAllByUserId(user.getId()).stream()
                .filter(service -> "đã thanh toán".equalsIgnoreCase(service.getPaymentStatus()))
                .collect(Collectors.toList());

        List<Map<String, Object>> response = paidServices.stream().map(service -> {
            Map<String, Object> map = new HashMap<>();
            ParkingService parkingService = parkingServiceRepository.findById(service.getParkingServiceId())
                    .orElse(null);

            if (parkingService != null) {
                map.put("serviceName", parkingService.getName());
                map.put("cameraUrl", parkingService.getCameraUrl());
                map.put("zone", parkingService.getZone());
                map.put("floor", parkingService.getFloor());
                map.put("slotNumber", parkingService.getSlotNumber());
            }

            map.put("startDate", service.getStartDate());
            map.put("endDate", service.getEndDate());
            map.put("paymentStatus", service.getPaymentStatus());
            map.put("paymentDate", service.getPaymentDate());

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

}
