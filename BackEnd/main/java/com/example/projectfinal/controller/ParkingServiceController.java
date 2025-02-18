//package com.example.projectfinal.controller;
//
//import com.example.projectfinal.Entity.ParkingService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/parking-services")
//public class ParkingServiceController {
//
//    @Autowired
//    private ParkingServiceService parkingServiceService;
//
//    @GetMapping
//    public ResponseEntity<List<ParkingService>> getAllServices() {
//        return ResponseEntity.ok(parkingServiceService.getAllServices());
//    }
//
//    @PostMapping
//    public ResponseEntity<ParkingService> addService(@RequestBody ParkingService service) {
//        return ResponseEntity.ok(parkingServiceService.addService(service)); // Sử dụng service đúng cách
//    }
//
//    @PostMapping("/assign-service")
//    public ResponseEntity<String> assignServiceToUser(
//            @RequestParam String userId,
//            @RequestParam Long serviceId,
//            @RequestParam int durationMonths) {
//        parkingServiceService.assignServiceToUser(userId, serviceId, durationMonths);
//        return ResponseEntity.ok("Service assigned successfully!");
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteService(@PathVariable Long id) {
//        parkingServiceService.deleteService(id);
//        return ResponseEntity.noContent().build();
//    }
//
//
//}
