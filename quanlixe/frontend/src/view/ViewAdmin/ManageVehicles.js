import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/ManageVehiclesAndUsers.css';

function ManageVehiclesAndUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  // Fetch vehicles of selected user
  const handleUserClick = async (user) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
      setSelectedUser(null);
      setVehicles([]);
    } else {
      setExpandedUserId(user.id);
      setSelectedUser(user);
      setEditUser(null);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`/api/admin/users/${user.id}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    }
  };

  // Handle edit user
  const handleEditUser = () => {
    setEditUser({ ...selectedUser });
  };

  // Handle save user changes
  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/api/admin/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => (user.id === editUser.id ? response.data : user)));
      setSelectedUser(response.data);
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle delete vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle) => {
    setEditVehicle(vehicle);
  };

  // Handle save vehicle changes
  const handleSaveVehicle = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/admin/vehicles/${editVehicle.id}`, editVehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(vehicles.map((v) => (v.id === editVehicle.id ? editVehicle : v)));
      setEditVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  return (
    <div className="manage-container">
      <h2>Quản Lý Xe và Người Dùng</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="user-list">
        <h3>Danh Sách Người Dùng</h3>
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-item">
            <div onClick={() => handleUserClick(user)}>
              <p><strong>{user.name}</strong> - {user.email}</p>
            </div>
            {expandedUserId === user.id && (
              <div className="user-details">
                <h4>Thông Tin Người Dùng</h4>
                {editUser ? (
                  <div>
                    <p><strong>Tên:</strong> <input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} /></p>
                    <p><strong>Email:</strong> <input type="text" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} /></p>
                    <p><strong>Số Điện Thoại:</strong> <input type="text" value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} /></p>
                    <button onClick={handleSaveUser}>Lưu</button>
                    <button onClick={() => setEditUser(null)}>Hủy</button>
                  </div>
                ) : (
                  <div>
                    <p><strong>Tên:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Số Điện Thoại:</strong> {selectedUser.phone}</p>
                    <button onClick={handleEditUser}>Chỉnh sửa</button>
                  </div>
                )}

                {vehicles.length > 0 && (
                  <div className="vehicle-list">
                    <h4>Danh Sách Xe</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Bảng Số</th>
                          <th>Loại Xe</th>
                          <th>Ảnh Trước</th>
                          <th>Ảnh Ngang</th>
                          <th>Ảnh Sau</th>
                          <th>Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td>{editVehicle?.id === vehicle.id ? (
                              <input
                                type="text"
                                value={editVehicle.licensePlate}
                                onChange={(e) => setEditVehicle({ ...editVehicle, licensePlate: e.target.value })}
                              />
                            ) : (
                              vehicle.licensePlate
                            )}</td>
                            <td>{vehicle.type}</td>
                            <td><img src={vehicle.frontImageUrl} alt="Ảnh Trước" width="100" /></td>
                            <td><img src={vehicle.sideImageUrl} alt="Ảnh Ngang" width="100" /></td>
                            <td><img src={vehicle.rearImageUrl} alt="Ảnh Sau" width="100" /></td>
                            <td>
                              {editVehicle?.id === vehicle.id ? (
                                <>
                                  <button onClick={handleSaveVehicle}>Lưu</button>
                                  <button onClick={() => setEditVehicle(null)}>Hủy</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleEditVehicle(vehicle)}>Sửa</button>
                                  <button onClick={() => handleDeleteVehicle(vehicle.id)}>Xóa</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageVehiclesAndUsers;
