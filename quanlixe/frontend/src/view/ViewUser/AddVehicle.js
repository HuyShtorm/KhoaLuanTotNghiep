import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AddVehicle.css'; // File CSS để định dạng giao diện

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    type: 'MOTORBIKE',
    frontImage: null,
    sideImage: null,
    rearImage: null,
  });

  const [previewImages, setPreviewImages] = useState({
    frontImage: null,
    sideImage: null,
    rearImage: null,
  });

  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData({ ...formData, [name]: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
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

    try {
      await axios.post('/api/users/add-vehicle', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Thành công: Thông tin xe đã được gửi để duyệt!');
      
      // Reset form và hình ảnh xem trước
      setFormData({
        licensePlate: '',
        type: 'MOTORBIKE',
        frontImage: null,
        sideImage: null,
        rearImage: null,
      });
      setPreviewImages({
        frontImage: null,
        sideImage: null,
        rearImage: null,
      });

      // Tải lại danh sách xe
      fetchVehicles();
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Lỗi: Không thể thêm xe. Vui lòng thử lại.');
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/users/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVehicleList(response.data);
    } catch (error) {
      setError('Không thể tải danh sách xe, vui lòng thử lại.');
      console.error('Lỗi tải danh sách xe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="add-vehicle">
      <h2>Thêm Thông Tin Xe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Biển số xe:</label>
          <input 
            type="text" 
            name="licensePlate" 
            value={formData.licensePlate} 
            onChange={handleInputChange} 
            placeholder="Nhập biển số xe" 
            required 
          />
        </div>
        <div className="form-group">
          <label>Loại xe:</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleInputChange}
          >
            <option value="MOTORBIKE">Xe Máy</option>
            <option value="CAR">Ô Tô</option>
            <option value="BICYCLE">Xe Đạp</option>
          </select>
        </div>
        <div className="image-upload">
          <label>Ảnh trước xe:</label>
          <div className="image-preview">
            <label htmlFor="frontImage" className="upload-placeholder">
              {previewImages.frontImage ? (
                <img src={previewImages.frontImage} alt="Front Preview" />
              ) : (
                <i className="fa fa-camera"></i>
              )}
            </label>
            <input 
              type="file" 
              id="frontImage" 
              name="frontImage" 
              onChange={handleFileChange} 
              required 
            />
          </div>
        </div>
        <div className="image-upload">
          <label>Ảnh ngang xe:</label>
          <div className="image-preview">
            <label htmlFor="sideImage" className="upload-placeholder">
              {previewImages.sideImage ? (
                <img src={previewImages.sideImage} alt="Side Preview" />
              ) : (
                <i className="fa fa-camera"></i>
              )}
            </label>
            <input 
              type="file" 
              id="sideImage" 
              name="sideImage" 
              onChange={handleFileChange} 
              required 
            />
          </div>
        </div>
        <div className="image-upload">
          <label>Ảnh sau xe ( có biển số ):</label>
          <div className="image-preview">
            <label htmlFor="rearImage" className="upload-placeholder">
              {previewImages.rearImage ? (
                <img src={previewImages.rearImage} alt="Rear Preview" />
              ) : (
                <i className="fa fa-camera"></i>
              )}
            </label>
            <input 
              type="file" 
              id="rearImage" 
              name="rearImage" 
              onChange={handleFileChange} 
              required 
            />
          </div>
        </div>
        <button className="submit-button" type="submit">Thêm Xe</button>
      </form>

      <h3>Danh Sách Xe</h3>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Biển Số</th>
            <th>Loại Xe</th>
            <th>Trạng Thái</th>
            <th>Ảnh Trước</th>
            <th>Ảnh Ngang</th>
            <th>Ảnh Sau</th>
          </tr>
        </thead>
        <tbody>
  {vehicleList.map((vehicle) => (
    <tr key={vehicle.id}>
      <td>{vehicle.licensePlate}</td>
      <td>
        {vehicle.type === "MOTORBIKE" ? "Xe máy" : 
         vehicle.type === "CAR" ? "Ô tô" : "Xe đạp"}
      </td>
      <td>
  {vehicle.status === "APPROVED" 
    ? "Đã duyệt" 
    : vehicle.status === "PENDING" 
      ? "Đang chờ duyệt" 
      : "Đã từ chối"}
</td>

      <td><img src={vehicle.frontImageUrl} alt="Ảnh trước" width="100" /></td>
      <td><img src={vehicle.sideImageUrl} alt="Ảnh ngang" width="100" /></td>
      <td><img src={vehicle.rearImageUrl} alt="Ảnh sau" width="100" /></td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default AddVehicle;
