import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const userResponse = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const vehicleResponse = await axios.get('/api/users/approved-vehicles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(vehicleResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Thông Tin Người Dùng</h2>
      <p>Tên: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Số điện thoại: {user?.phone}</p>

      <h3>Danh Sách Xe Đã Phê Duyệt</h3>
      {vehicles.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Bảng số</th>
              <th>Loại xe</th>
              <th>Ảnh trước</th>
              <th>Ảnh ngang</th>
              <th>Ảnh sau</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chưa có xe nào được phê duyệt.</p>
      )}
    </div>
  );
};

export default UserProfile;
