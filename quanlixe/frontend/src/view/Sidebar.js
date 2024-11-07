import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/App.css';

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>Quản lý Xe Chung Cư</h2>
      <ul>
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Tổng Quan</NavLink></li>
        <li><NavLink to="/parkingstatus" className={({ isActive }) => isActive ? "active" : ""}>Trạng Thái Bãi Xe</NavLink></li>
        <li><NavLink to="/parkingmap" className={({ isActive }) => isActive ? "active" : ""}>Sơ Đồ Bãi Đỗ</NavLink></li>
        <li><NavLink to="/vehiclehistory" className={({ isActive }) => isActive ? "active" : ""}>Lịch Sử Ra Vào</NavLink></li>

        {role === 'ADMIN' && (
          <>
            <li><NavLink to="/managevehicles" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Xe</NavLink></li>
            <li><NavLink to="/manageusers" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Người Dùng</NavLink></li>
            <li><NavLink to="/approvevehicles" className={({ isActive }) => isActive ? "active" : ""}>Xác Nhận Xe</NavLink></li>
          </>
        )}

        {role === 'USER' && (
          <>
            <li><NavLink to="/addvehicle" className={({ isActive }) => isActive ? "active" : ""}>Thêm Thông Tin Xe</NavLink></li>
            <li><NavLink to="/userprofile" className={({ isActive }) => isActive ? "active" : ""}>Thông tin của Tôi</NavLink></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
