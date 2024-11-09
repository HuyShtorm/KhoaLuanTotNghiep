import React, { useState, useEffect } from 'react';
import '../../css/Service.css';

function ServiceUser() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/services')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setServices(data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  const handleServiceSelection = (serviceId) => {
    const userId = localStorage.getItem('userId') || 'user-id-placeholder'; // Thay thế bằng ID thực tế
    fetch(`http://localhost:8080/api/services/assign/${userId}/${serviceId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          setSelectedService(serviceId);
          alert('Dịch vụ đã được chọn thành công!');
        } else {
          alert('Lỗi khi chọn dịch vụ.');
        }
      })
      .catch((error) => console.error('Error assigning service:', error));
  };

  return (
    <div className="service-user-container">
      <h2>Danh Sách Dịch Vụ</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>Giá: {service.price} VND</p>
            <p>{service.description}</p>
            <button
              onClick={() => handleServiceSelection(service.id)}
              disabled={selectedService === service.id}
            >
              {selectedService === service.id ? 'Đã Chọn' : 'Chọn Dịch Vụ'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceUser;
