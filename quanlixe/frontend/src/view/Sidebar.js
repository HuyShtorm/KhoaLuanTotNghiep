import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/App.css';

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>{role === 'ADMIN' ? 'Quản lý Xe Chung Cư' : 'Quản lý Xe Cá Nhân'}</h2> {/* Thay đổi tiêu đề dựa vào role */}
      <ul>
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Tổng Quan</NavLink></li>
       
        <li><NavLink to="/parkingmap" className={({ isActive }) => isActive ? "active" : ""}>Sơ Đồ Bãi Đỗ</NavLink></li>
        <li><NavLink to="/vehiclehistory" className={({ isActive }) => isActive ? "active" : ""}>Lịch Sử Ra Vào</NavLink></li>

        {role === 'ADMIN' && (
          <>
           <li><NavLink to="/parkingadminservice" className={({ isActive }) => isActive ? "active" : ""}>Dịch Vụ Bãi Đỗ</NavLink></li>
           <li><NavLink to="/parkingstatus" className={({ isActive }) => isActive ? "active" : ""}>Trạng Thái Bãi Xe</NavLink></li>
            <li><NavLink to="/managevehicles" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Xe và Người Dùng </NavLink></li>
            {/* <li><NavLink to="/manageusers" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Người Dùng</NavLink></li> */}
            <li><NavLink to="/approvevehicles" className={({ isActive }) => isActive ? "active" : ""}>Xác Nhận Xe</NavLink></li>
          </>
        )}

        {role === 'USER' && (
          <> 
          <li><NavLink to="/parkinguserservice" className={({ isActive }) => isActive ? "active" : ""}>Dịch Vụ Đăng Ký Bãi Đỗ</NavLink></li>
          <li><NavLink to="/myparkingstatus" className={({ isActive }) => isActive ? "active" : ""}>Trạng Thái Bãi Xe Của Tôi</NavLink></li>
            <li><NavLink to="/addvehicle" className={({ isActive }) => isActive ? "active" : ""}>Thêm Thông Tin Xe</NavLink></li>
            <li><NavLink to="/userprofile" className={({ isActive }) => isActive ? "active" : ""}>Thông tin của Tôi</NavLink></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
