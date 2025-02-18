import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/ManageVehiclesAndUsers.css";
import defaultAvatar from "../../img/avatar.png";
const ManageVehiclesAndUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Fetch danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Xử lý khi click vào một user
  const handleUserClick = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        console.error("Token không tồn tại.");
        alert("Bạn cần đăng nhập để thực hiện thao tác này.");
        return;
      }
  
      const userResponse = await axios.get(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
  
      const vehicleResponse = await axios.get(`/api/admin/users/${userId}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
  
      setSelectedUser(userResponse.data);
      setVehicles(vehicleResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details or vehicles:", error);
      if (error.response && error.response.status === 403) {
        alert("Bạn không có quyền truy cập thông tin này. Vui lòng kiểm tra lại.");
      }
      setLoading(false);
    }
  };
  

  return (
    <div className="admin-container">
      <h1>Quản lý Người Dùng và Xe</h1>

      {loading && <p>Đang tải dữ liệu...</p>}

      {/* Danh sách người dùng */}
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => handleUserClick(user.id)}
          >
            <img
              src={user.avatarUrl || defaultAvatar}
              alt="Avatar"
              className="user-avatar"
            />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
       
          </div>
        ))}
      </div>

      {/* Thông tin chi tiết người dùng */}
      {selectedUser && (
        <div className="user-details-container">
  {/* Chi tiết người dùng */}
  <div className="user-details">
    <div className="user-info">
      <h2>Chi tiết Người Dùng</h2>
      <p><strong>Tên:</strong> {selectedUser.name}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
      <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
    </div>
    <div className="user-avatar-wrapper">
      <img
        src={selectedUser.avatarUrl || defaultAvatar}
        alt="Avatar"
        className="user-avatar-right"
      />
    </div>
  </div>

  {/* Danh sách xe */}
  <div className="vehicle-list">
    <h3>Danh sách Xe</h3>
    {vehicles.length > 0 ? (
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Biển số</th>
            <th>Loại xe</th>
            <th>Trạng thái</th>
            <th>Hình ảnh</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={vehicle.id || `vehicle-${index}`}>
              <td>{vehicle.licensePlate}</td>
              <td>{vehicle.type}</td>
              <td>
                {vehicle.status === "APPROVED"
                  ? "Đã duyệt"
                  : vehicle.status === "PENDING"
                  ? "Đang chờ duyệt"
                  : "Đã từ chối"}
              </td>
              <td>
                <div className="vehicle-images">
                  <img
                    src={vehicle.frontImageUrl}
                    alt="Ảnh trước"
                    className="vehicle-image"
                  />
                  <img
                    src={vehicle.sideImageUrl}
                    alt="Ảnh ngang"
                    className="vehicle-image"
                  />
                  <img
                    src={vehicle.rearImageUrl}
                    alt="Ảnh sau"
                    className="vehicle-image"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Người dùng này chưa có xe.</p>
    )}
  </div>
</div>

     
      )}
    </div>
  );
};

export default ManageVehiclesAndUsers;
