import React from 'react';
import Sidebar from '../Sidebar'; // Import Sidebar
import '/HocKiCuoi/KLTN/projectweb/quanlixe/frontend/src/css/Admin.css'; // Tùy chọn: import CSS riêng cho trang Admin

const Admin = () => {
  return (
    <div className="admin-layout">
      {/* Phần Sidebar */}
      <Sidebar role="ADMIN" /> 

      {/* Phần nội dung Admin */}
      <div className="admin-content">
        <h1>Quản lý admin</h1>
        <p>Nội dung quản lý dành cho admin sẽ hiển thị ở đây.</p>
        {/* Thêm các nội dung hoặc component liên quan đến Admin tại đây */}
      </div>
    </div>
  );
};

export default Admin;
