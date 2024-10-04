import React, { useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      
      if (response.status === 200) {
        // Lưu token và role vào localStorage
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        setMessage('Đăng nhập thành công!');

        // Điều hướng người dùng dựa trên vai trò
        if (response.data.role === 'ROLE_ADMIN') {
          navigate('/admin'); // Chuyển đến trang admin
        } else {
          navigate('/user');  // Chuyển đến trang user
        }
      } else {
        setMessage('Đăng nhập thất bại! Vui lòng thử lại.');
      }
    } catch (error) {
      // Kiểm tra lỗi trả về từ server
      if (error.response && error.response.status === 401) {
        setMessage('Tài khoản hoặc mật khẩu không chính xác.');
      } else {
        setMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dn">
      <h2>Đăng Nhập</h2>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Mật khẩu:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <input type="submit" value="Đăng Nhập" className="buttondn" />
      <p>{message}</p>
    </form>
  );
};

export default LoginForm;
