import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

function AddUser() {
  return <h2>Thêm người dùng</h2>;
}

function EditUser() {
  return <h2>Chỉnh sửa người dùng</h2>;
}

function DeleteUser() {
  return <h2>Xóa người dùng</h2>;
}

function UserManagement() {
  return (
    <div>
      <h1>Quản lý người dùng</h1>

      {/* Navbar phụ */}
      <nav className="sub-navbar">
        <ul>
          <li><Link to="add">Thêm người dùng</Link></li>
          <li><Link to="edit">Chỉnh sửa người dùng</Link></li>
          <li><Link to="delete">Xóa người dùng</Link></li>
        </ul>
      </nav>

      {/* Các Route cho navbar phụ */}
      <Routes>
        <Route path="add" element={<AddUser />} />
        <Route path="edit" element={<EditUser />} />
        <Route path="delete" element={<DeleteUser />} />
      </Routes>
    </div>
  );
}

export default UserManagement;
