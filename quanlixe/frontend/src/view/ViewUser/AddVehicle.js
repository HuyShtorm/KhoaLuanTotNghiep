import React, { useState } from 'react';
import axios from 'axios';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    type: 'MOTORBIKE',
    frontImage: null,
    sideImage: null,
    rearImage: null
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('licensePlate', formData.licensePlate);
    data.append('type', formData.type);
    data.append('frontImage', formData.frontImage);
    data.append('sideImage', formData.sideImage);
    data.append('rearImage', formData.rearImage);

    await axios.post('/api/users/add-vehicle', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('Vehicle information submitted for approval.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="licensePlate" onChange={handleInputChange} placeholder="License Plate" required />
      <select name="type" onChange={handleInputChange}>
        <option value="MOTORBIKE">Motorbike</option>
        <option value="CAR">Car</option>
        <option value="BICYCLE">Bicycle</option>
      </select>
      <input type="file" name="frontImage" onChange={handleFileChange} required />
      <input type="file" name="sideImage" onChange={handleFileChange} required />
      <input type="file" name="rearImage" onChange={handleFileChange} required />
      <button type="submit">Add Vehicle</button>
    </form>
  );
};

export default AddVehicle;
