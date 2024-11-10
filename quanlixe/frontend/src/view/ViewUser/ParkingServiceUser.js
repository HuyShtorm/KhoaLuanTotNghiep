import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ParkingServiceUser() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/users/parking-services', { // API user load services
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                alert('Failed to load services.');
            }
        };
        fetchServices();
    }, []);

    const handleSelectService = async (serviceId) => {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.post(`/api/users/subscribe-service/${serviceId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Subscribed successfully!');
      } catch (error) {
          console.error('Error subscribing to service:', error);
          alert('Failed to subscribe to service.');
      }
  };
  

    return (
        <div>
            <h2>Available Parking Services</h2>
            <ul>
                {services.map((service) => (
                    <li key={service.id}>
                        <h4>{service.name}</h4>
                        <p>Price: ${service.price}</p>
                        <p>Duration: {service.durationMonths} months</p>
                        <p>Applicable for: {service.applicableType}</p>
                        <button onClick={() => handleSelectService(service.id)}>Subscribe</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ParkingServiceUser;
