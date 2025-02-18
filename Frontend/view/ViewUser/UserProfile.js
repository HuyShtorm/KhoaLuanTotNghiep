import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/UserProfile.css"; // CSS file
import defaultAvatar from "../../img/avatar.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true); // Để hiển thị loading
  const [editMode, setEditMode] = useState(false); // Chỉ định trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    address: "",
    avatar: null,
  });
  const [showPassword, setShowPassword] = useState(false); // Hiển thị hoặc ẩn mật khẩu

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const userResponse = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          ...userResponse.data,
          avatarUrl: userResponse.data.avatarUrl || defaultAvatar, // Đảm bảo avatarUrl có giá trị mặc định
        });;
        setFormData({
          name: userResponse.data.name,
          phone: userResponse.data.phone,
          oldPassword: "",
          newPassword: "",
          avatar: null,
          address: userResponse.data.address,
        });

        const vehicleResponse = await axios.get("/api/users/approved-vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(vehicleResponse.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải thông tin người dùng.",
        });
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
    const token = localStorage.getItem("token");
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("phone", formData.phone);
    updateData.append("address", formData.address);

    if (formData.oldPassword && formData.newPassword) {
      updateData.append("oldPassword", formData.oldPassword);
      updateData.append("newPassword", formData.newPassword);
    }
    if (formData.avatar) {
      updateData.append("avatar", formData.avatar);
    }

    try {
      await axios.put("/api/users/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Thông tin người dùng đã được cập nhật.",
      });

      setEditMode(false); // Thoát chế độ chỉnh sửa
      const updatedUser = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updatedUser.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại!",
        text: "Không thể cập nhật thông tin. Vui lòng thử lại.",
      });
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        Thông Tin Người Dùng
        <button
          className="edit-button"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Hủy" : "Chỉnh sửa"}
        </button>
      </h2>
      <div className="profile-content">
        <div className="profile-avatar">
        <img
  src={
    editMode
      ? (formData.avatar
        ? URL.createObjectURL(formData.avatar)
        : user?.avatarUrl || defaultAvatar)
      : (user?.avatarUrl || defaultAvatar)
  }
  alt="Avatar"
  className="avatar-image"
/>


          {editMode && (
            <label className="upload-avatar">
              Tải ảnh lên
              <input type="file" name="avatar" onChange={handleAvatarChange} />
            </label>
          )}
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Tên:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.name}</span>
            )}
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>

          <div className="info-item">
            <label>Số điện thoại:</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.phone}</span>
            )}
          </div>
          <div className="info-item">
  <label>Địa chỉ:</label>
  {editMode ? (
    <input
      type="text"
      name="address"
      value={formData.address}
      onChange={handleInputChange}
    />
  ) : (
    <span>{user?.address || "Chưa có địa chỉ"}</span>
  )}
</div>


          {editMode && (
            <>
              <div className="info-item">
                <label>Mật khẩu cũ:</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                  />
                  <button type="button" onClick={togglePassword}>
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <div className="info-item">
                <label>Mật khẩu mới:</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <button type="button" onClick={togglePassword}>
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {editMode && (
        <div className="edit-buttons">
          <button onClick={handleSave} className="save-button">
            Lưu
          </button>
        </div>
      )}   <h3>Danh Sách Xe Đã Được Phê Duyệt</h3>
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
                <td>
                  {vehicle.type === "MOTORBIKE"
                    ? "Xe máy"
                    : vehicle.type === "CAR"
                    ? "Ô tô"
                    : "Xe đạp"}
                </td>
                <td>
                  <img
                    src={vehicle.frontImageUrl}
                    alt="Ảnh trước"
                    width="100"
                    onError={(e) => (e.target.src = "/default-front.jpg")}
                  />
                </td>
                <td>
                  <img
                    src={vehicle.sideImageUrl}
                    alt="Ảnh ngang"
                    width="100"
                    onError={(e) => (e.target.src = "/default-side.jpg")}
                  />
                </td>
                <td>
                  <img
                    src={vehicle.rearImageUrl}
                    alt="Ảnh sau"
                    width="100"
                    onError={(e) => (e.target.src = "/default-rear.jpg")}
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
