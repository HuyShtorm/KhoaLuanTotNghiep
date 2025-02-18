import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/MyParkingStatus.css";

function MyParkingStatus() {
  const [paidServices, setPaidServices] = useState([]);

  useEffect(() => {
    const fetchPaidServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/users/paid-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaidServices(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách dịch vụ đã thanh toán:", error);
      }
    };

    fetchPaidServices();
  }, []);

  const groupedServices = paidServices.reduce((groups, service) => {
    const key = `${service.zone}`;
    if (!groups[key]) {
      groups[key] = {};
    }
    if (!groups[key][service.floor]) {
      groups[key][service.floor] = [];
    }
    groups[key][service.floor].push(service);
    return groups;
  }, {});

  const zoneDescriptions = {
    "Khu A": "Dành cho Ô tô",
    "Khu B": "Dành cho Xe máy",
    "Khu C": "Dành cho Xe đạp",
  };

  return (
    <div className="parking-status-container">
      <h1 className="parking-status-title">My Parking Status</h1>
      {Object.entries(groupedServices).map(([zone, floors]) => (
        <div key={zone} className="service-group">
          <h2>{zone}</h2>
          <p>{zoneDescriptions[zone]}</p>
          {Object.entries(floors).map(([floor, services]) => (
            <div key={floor} className="floor-container">
              <h3>Tầng: {floor}</h3>
              <div className="cameras-container">
                {services.map((service, index) => (
                  <div key={index} className="camera-card">
                    <h4>{service.serviceName} ({service.slotNumber})</h4>
                    <div className="video-wrapper">
                      {service.cameraUrl ? (
                        <iframe
                          src={service.cameraUrl}
                          title={`Camera Stream for ${service.serviceName}`}
                        />
                      ) : (
                        <p>Không có camera.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyParkingStatus;
