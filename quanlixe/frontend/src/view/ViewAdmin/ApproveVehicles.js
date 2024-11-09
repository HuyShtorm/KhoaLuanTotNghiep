import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPendingVehicles = async () => {
      try {
        setLoading(true); // Bắt đầu trạng thái loading
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/pending-vehicles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setVehicles(response.data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách xe cần xác nhận.');
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };
  
    fetchPendingVehicles();
  }, []);
  const handleApprove = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/admin/approve-vehicle',
        { vehicleId, status: 'APPROVED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      alert('Xe đã được xác nhận.');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi xác nhận xe.');
    }
  };

  const handleReject = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/admin/approve-vehicle',
        { vehicleId, status: 'REJECTED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      alert('Xe đã bị từ chối.');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi từ chối xe.');
    }
  };

  if (error) return <p>{error}</p>;

 return (
  <div className="admin-vehicle-approval">
    <h2>Danh sách xe cần xác nhận</h2>
    {vehicles.length === 0 ? (
      <p>Không có xe nào cần xác nhận.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Bảng số</th>
            <th>Loại xe</th>
            <th>Ảnh trước</th>
            <th>Ảnh ngang</th>
            <th>Ảnh sau</th>
            <th>Người dùng</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.licensePlate}</td>
              <td>{vehicle.type}</td>
              <td>
                <img src={vehicle.frontImageUrl} alt="Ảnh trước" width="100" onError={(e) => e.target.src = '/default-front.jpg'} />
              </td>
              <td>
                <img src={vehicle.sideImageUrl} alt="Ảnh ngang" width="100" onError={(e) => e.target.src = '/default-side.jpg'} />
              </td>
              <td>
                <img src={vehicle.rearImageUrl} alt="Ảnh sau" width="100" onError={(e) => e.target.src = '/default-rear.jpg'} />
              </td>
              <td>{vehicle.userName}</td>
              <td>{vehicle.userEmail}</td>
              <td>
                <button onClick={() => handleApprove(vehicle.id)}>Xác nhận</button>
                <button onClick={() => handleReject(vehicle.id)}>Từ chối</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default ApproveVehicles;
