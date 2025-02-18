package com.example.projectfinal.Entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Data
public class UserParkingServiceId implements Serializable {
    private String userId;
    private Integer parkingServiceId;
    private UUID vehicleId; // Thêm vehicleId vào composite key

    public UserParkingServiceId() {}

    public UserParkingServiceId(String userId, Integer parkingServiceId, UUID vehicleId) {
        this.userId = userId;
        this.parkingServiceId = parkingServiceId;
        this.vehicleId = vehicleId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserParkingServiceId that = (UserParkingServiceId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(parkingServiceId, that.parkingServiceId) &&
                Objects.equals(vehicleId, that.vehicleId); // So sánh thêm vehicleId
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, parkingServiceId, vehicleId); // Hash thêm vehicleId
    }
}
