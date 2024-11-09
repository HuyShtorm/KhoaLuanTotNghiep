import React, { useState, useEffect } from 'react';
import '../../css/Service.css';

function ServiceAdmin() {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      name: serviceName,
      price: servicePrice,
      description: description,
    };

    fetch('http://localhost:8080/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newService),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add service');
        }
        return response.json();
      })
      .then((data) => {
        setServices((prevServices) => [...prevServices, data]);
        setServiceName('');
        setServicePrice('');
        setDescription('');
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="service-admin-container">
      <h2>Thêm Dịch Vụ Bãi Đỗ</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label>Tên Dịch Vụ:</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Giá Dịch Vụ:</label>
          <input
            type="number"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mô Tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Thêm Dịch Vụ
        </button>
      </form>

      <h3>Danh Sách Dịch Vụ Hiện Tại</h3>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h4>{service.name}</h4>
            <p>Giá: {service.price} VND</p>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceAdmin;
