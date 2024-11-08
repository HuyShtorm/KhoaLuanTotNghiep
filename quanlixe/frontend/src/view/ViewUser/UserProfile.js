import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/UserProfile.css'; // CSS file

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    avatar: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const userResponse = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        setFormData({
          name: userResponse.data.name,
          password: '',
          avatar: null,
        });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0],
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const updateData = new FormData();
    updateData.append('name', formData.name);
    if (formData.password) {
      updateData.append('password', formData.password);
    }
    if (formData.avatar) {
      updateData.append('avatar', formData.avatar);
    }

    try {
      await axios.put('/api/users/update', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditMode(false);
      const updatedUser = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updatedUser.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        Thông Tin Người Dùng
        <button className="edit-button" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
      </h2>
      <div className="profile-content">
        <div className="profile-info">
          <p>Tên: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Số điện thoại: {user?.phone}</p>
        </div>
        <div className="profile-avatar">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="avatar-image"
          />
        </div>
      </div>

      {editMode && (
        <div className="edit-mode">
          <label>
            Avatar:
            <input type="file" name="avatar" onChange={handleAvatarChange} />
          </label>
          <label>
            Tên:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Mật khẩu mới:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <div className="edit-buttons">
            <button onClick={handleSave}>Lưu</button>
            <button onClick={() => setEditMode(false)}>Hủy</button>
          </div>
        </div>
      )}

      <h3>Danh Sách Xe Đã Phê Duyệt</h3>
      {vehicles.length > 0 ? (
        <table className="vehicle-table">
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
                  <img
                    src={vehicle.frontImageUrl}
                    alt="Ảnh trước"
                    width="100"
                    onError={(e) => (e.target.src = '/default-front.jpg')}
                  />
                </td>
                <td>
                  <img
                    src={vehicle.sideImageUrl}
                    alt="Ảnh ngang"
                    width="100"
                    onError={(e) => (e.target.src = '/default-side.jpg')}
                  />
                </td>
                <td>
                  <img
                    src={vehicle.rearImageUrl}
                    alt="Ảnh sau"
                    width="100"
                    onError={(e) => (e.target.src = '/default-rear.jpg')}
                  />
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
