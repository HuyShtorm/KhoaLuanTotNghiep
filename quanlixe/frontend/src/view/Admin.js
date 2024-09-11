import React, { useState } from 'react';
import UserManagement from './ViewAdmin/UserManagement';
import VehicleManagement from './ViewAdmin/VehicleManagement';
import Statistics from './ViewAdmin/Statistics';
import SystemConfig from './ViewAdmin/SystemConfig';
import '../css/Admin.css';

function Admin() {
  // Sử dụng state để lưu trữ trang hiện tại
  const [selectedPage, setSelectedPage] = useState('user-management');

  // Hàm để hiển thị nội dung tương ứng với mục được chọn
  const renderContent = () => {
    switch (selectedPage) {
      case 'user-management':
        return <UserManagement />;
      case 'vehicle-management':
        return <VehicleManagement />;
      case 'statistics':
        return <Statistics />;
      case 'system-config':
        return <SystemConfig />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div>
      {/* Navbar chính */}
      <nav className="function-menu">
        <ul >
          <li onClick={() => setSelectedPage('user-management')}>Quản lý người dùng</li>
          <li onClick={() => setSelectedPage('vehicle-management')}>Quản lý xe</li>
          <li onClick={() => setSelectedPage('statistics')}>Thống kê và báo cáo</li>
          <li onClick={() => setSelectedPage('system-config')}>Cấu hình hệ thống</li>
        </ul>
      </nav>

      {/* Nội dung hiển thị tương ứng */}
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;
