    package com.example.projectfinal.repository;

    import com.example.projectfinal.Entity.UserParkingService;
    import com.example.projectfinal.Entity.UserParkingServiceId;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;
    import java.util.UUID;

    @Repository
    public interface UserParkingServiceRepository extends JpaRepository<UserParkingService, UserParkingServiceId> {

        @Query("SELECT ups FROM UserParkingService ups WHERE ups.userId = :userId AND ups.parkingServiceId = :serviceId AND ups.vehicleId = :vehicleId")
        UserParkingService findByUserAndParkingServiceAndVehicle(
                @Param("userId") String userId,
                @Param("serviceId") Integer serviceId,
                @Param("vehicleId") UUID vehicleId
        );
        @Query("SELECT ups FROM UserParkingService ups WHERE ups.userId = :userId")
        List<UserParkingService> findAllByUserId(@Param("userId") String userId);
        // Kiểm tra nếu dịch vụ đã được đăng ký bởi bất kỳ xe nào
        @Query("SELECT CASE WHEN COUNT(ups) > 0 THEN true ELSE false END FROM UserParkingService ups WHERE ups.parkingServiceId = :parkingServiceId")
        boolean existsByParkingServiceId(@Param("parkingServiceId") Integer parkingServiceId);

        @Query("SELECT CASE WHEN COUNT(ups) > 0 THEN true ELSE false END FROM UserParkingService ups WHERE ups.vehicleId = :vehicleId")
        boolean existsByVehicleId(@Param("vehicleId") UUID vehicleId);

        @Query("SELECT CASE WHEN COUNT(ups) > 0 THEN true ELSE false END FROM UserParkingService ups WHERE ups.vehicleId = :vehicleId AND ups.parkingServiceId = :parkingServiceId")
        boolean existsByVehicleIdAndParkingServiceId(@Param("vehicleId") UUID vehicleId, @Param("parkingServiceId") Integer parkingServiceId);
        @Query("SELECT ups FROM UserParkingService ups WHERE ups.userId = :userId AND " +
                "(ups.paymentDueDate < CURRENT_DATE OR ups.endDate < CURRENT_DATE)")
        List<UserParkingService> findExpiredServicesByUser(String userId);




    }



