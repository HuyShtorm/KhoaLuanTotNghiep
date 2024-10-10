

import React, { useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
    
        // Kiểm tra phản hồi từ API
        console.log("Response from API:", response.data);
  
        const role = response.data.roles;
        if (role.includes('ADMIN')) {
          navigate('/admin');
        } else if (role.includes('OWNER')) {
          navigate('/owner');
        } else if (role.includes('USER')) {
          navigate('/user');
        } else if (role.includes('MODERATOR')) {
          navigate('/moderator');
        }
        
        else {
          setMessage('Vai trò không hợp lệ!');
        }
        
      } else {
        setMessage('Đăng nhập thất bại!');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Tài khoản hoặc mật khẩu không chính xác.');
      } else if (error.response && error.response.status === 500) {
        setMessage('Lỗi máy chủ. Vui lòng thử lại sau.');
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
  <div className="password-field">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="password-input"
    />
    <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</label>

      <input type="submit" value="Đăng Nhập" className="buttondn" />
      <p>{message}</p>
    </form>
  );
};

export default LoginForm;
