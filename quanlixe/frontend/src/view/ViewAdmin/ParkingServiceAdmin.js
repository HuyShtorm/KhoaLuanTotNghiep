import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ParkingServiceAdmin() {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        price: 0,
        applicableType: 'MOTORBIKE',
        durationMonths: 1, // Thời gian mặc định là 1 tháng
        description: ''
    });

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/admin/parking-services', { // Đảm bảo endpoint khớp với backend
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService({ ...newService, [name]: value });
    };

    const handleAddService = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/admin/add-parking-service', newService, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices([...services, response.data]);
            alert('Service added successfully');
            setNewService({
                name: '',
                price: 0,
                applicableType: 'MOTORBIKE',
                durationMonths: 1,
                description: ''
            });
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service. Please try again.');
        }
    };

    return (
        <div>
            <h2>Manage Parking Services</h2>
            <div>
                <h3>Add New Service</h3>
                <input name="name" placeholder="Name" value={newService.name} onChange={handleInputChange} />
                <input name="price" type="number" placeholder="Price" value={newService.price} onChange={handleInputChange} />
                <select name="applicableType" value={newService.applicableType} onChange={handleInputChange}>
                    <option value="MOTORBIKE">Motorbike</option>
                    <option value="BICYCLE">Bicycle</option>
                    <option value="CAR">Car</option>
                </select>
                <input
                    name="durationMonths"
                    type="number"
                    placeholder="Duration (Months)"
                    value={newService.durationMonths}
                    onChange={handleInputChange}
                />
                <textarea name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} />
                <button onClick={handleAddService}>Add Service</button>
            </div>

            <h3>Existing Services</h3>
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <h4>{service.name} - {service.applicableType}</h4>
                        <p>Price: ${service.price}</p>
                        <p>Duration: {service.durationMonths} months</p>
                        <p>Description: {service.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ParkingServiceAdmin;
