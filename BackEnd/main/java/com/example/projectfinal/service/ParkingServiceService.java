package com.example.projectfinal.service;

import com.example.projectfinal.Entity.ParkingService;
import com.example.projectfinal.Entity.User;
import com.example.projectfinal.Entity.UserParkingService;
import com.example.projectfinal.Entity.Vehicle;
import com.example.projectfinal.dto.ServiceRegistrationDTO;
import com.example.projectfinal.repository.ParkingServiceRepository;
import com.example.projectfinal.repository.UserParkingServiceRepository;
import com.example.projectfinal.repository.UserRepository;
import com.example.projectfinal.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ParkingServiceService {

    @Autowired
    private ParkingServiceRepository parkingServiceRepository;
    @Autowired
    private UserParkingServiceRepository userParkingServiceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;


    public ParkingService addParkingService(ParkingService parkingService) {


        List<Integer> occupiedSlots = parkingServiceRepository.findOccupiedSlots(parkingService.getZone(), parkingService.getFloor());
        if (occupiedSlots.contains(parkingService.getSlotNumber())) {
            throw new IllegalArgumentException("Vị trí đã được sử dụng!");
        }

        // Đánh dấu vị trí là đã chiếm
        parkingService.setIsOccupied(true);
        if (parkingService.getDurationMonths() != null) {
            LocalDate expiryDate = LocalDate.now().plusMonths(parkingService.getDurationMonths());
            parkingService.setExpiryDate(expiryDate);
        } else {
            throw new IllegalArgumentException("Duration months cannot be null");
        }
        return parkingServiceRepository.save(parkingService);
    }

    public List<ParkingService> getAllParkingServices() {
        return parkingServiceRepository.findAll();
    }
    public List<Integer> getAvailableSlots(String zone, String floor, int totalSlots) {
        List<Integer> occupiedSlots = parkingServiceRepository.findOccupiedSlots(zone, floor);
        List<Integer> allSlots = IntStream.rangeClosed(1, totalSlots).boxed().collect(Collectors.toList());
        allSlots.removeAll(occupiedSlots);
        return allSlots;
    }
    public List<UserParkingService> getRegisteredServicesByUser(String userId) {
        List<UserParkingService> services = userParkingServiceRepository.findAllByUserId(userId);
        System.out.println("Registered services: " + services); // Debug
        return services;
    }
    public List<ParkingService> getAvailableServices() {
        return parkingServiceRepository.findAllUnlockedServices();
    }

    @Transactional
    public void lockService(Integer serviceId) {
        ParkingService service = parkingServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        service.setIsLocked(true);
        parkingServiceRepository.save(service);
    }


    @Transactional
    public void unlockService(Integer serviceId) {
        ParkingService service = parkingServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        service.setIsLocked(false);
        parkingServiceRepository.save(service);
    }

    public List<ServiceRegistrationDTO> getAllServiceRegistrations() {
        List<UserParkingService> registrations = userParkingServiceRepository.findAll();
        return registrations.stream()
                .map(registration -> {
                    ParkingService service = parkingServiceRepository.findById(registration.getParkingServiceId())
                            .orElseThrow(() -> new RuntimeException("Service not found"));
                    User user = userRepository.findById(registration.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Vehicle vehicle = vehicleRepository.findById(registration.getVehicleId())
                            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

                    return new ServiceRegistrationDTO(
                            service.getId(),
                            user.getName(),
                            vehicle.getLicensePlate(),
                            user.getEmail()

                    );
                })
                .collect(Collectors.toList());
    }
    public List<UserParkingService> getOverduePaymentServices(String userId) {
        // Lấy danh sách dịch vụ của người dùng có trạng thái "Chưa thanh toán"
        return userParkingServiceRepository.findAllByUserId(userId).stream()
                .filter(service -> "Chưa thanh toán".equalsIgnoreCase(service.getPaymentStatus())
                        && service.getPaymentDueDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }
    @Scheduled(cron = "0 0 0 * * *") // Chạy mỗi ngày vào nửa đêm
    public void releaseExpiredServices() {
        // Lấy danh sách các dịch vụ hết hạn
        List<UserParkingService> expiredServices = userParkingServiceRepository.findAll().stream()
                .filter(service ->
                        LocalDate.now().isAfter(service.getPaymentDueDate()) ||
                                LocalDate.now().isAfter(service.getEndDate())
                )
                .collect(Collectors.toList());

        for (UserParkingService service : expiredServices) {
            // Cập nhật trạng thái is_locked của parking_services
            ParkingService parkingService = parkingServiceRepository.findById(service.getParkingServiceId())
                    .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại."));
            parkingService.setIsLocked(false); // Mở khóa dịch vụ
            parkingServiceRepository.save(parkingService);

            // Xóa bản ghi từ user_parking_services
            userParkingServiceRepository.delete(service);
        }
    }







}
