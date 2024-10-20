import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/App.css';

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>Quản lý Xe Chung Cư</h2>
      <ul>
        {/* Link chung cho cả admin và user */}
        <li><NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink></li>
        <li><NavLink to="/parkingstatus" activeClassName="active">Trạng Thái Bãi Xe</NavLink></li>
        <li><NavLink to="/parkingmap" activeClassName="active">Sơ Đồ Bãi Đỗ</NavLink></li>
        <li><NavLink to="/vehiclehistory" activeClassName="active">Lịch Sử Ra Vào</NavLink></li>

        {/* Link riêng cho admin */}
        {role === 'ADMIN' && (
          <>
            <li><NavLink to="/managevehicles" activeClassName="active">Quản Lý Xe</NavLink></li>
            <li><NavLink to="/manageusers" activeClassName="active">Quản Lý Người Dùng</NavLink></li>
            <li><NavLink to="/approvevehicles" activeClassName="active">Xác Nhận Xe</NavLink></li>
          </>
        )}

        {/* Link riêng cho user */}
        {role === 'USER' && (
          <>
            <li><NavLink to="/addvehicle" activeClassName="active">Thêm Thông Tin Xe</NavLink></li>
            <li><NavLink to="/myvehicles" activeClassName="active">Xe Của Tôi</NavLink></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
