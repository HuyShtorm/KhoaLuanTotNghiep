import React, { useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // Trạng thái quên mật khẩu
  const [otpSent, setOtpSent] = useState(false); // Trạng thái đã gửi OTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = () => {
    setForgotPassword(true); // Hiện giao diện quên mật khẩu
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email: formData.email });
      if (response.status === 200) {
        setOtpSent(true);
        setMessage('OTP đã được gửi tới email của bạn.');
      } else {
        setMessage('Không thể gửi OTP. Vui lòng thử lại sau.');
      }
    } catch (error) {
      setMessage('Lỗi khi gửi OTP. Vui lòng thử lại sau.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu không khớp. Vui lòng nhập lại.');
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email: formData.email, 
        token: otp,
        newPassword: newPassword,
      });
      if (response.status === 200) {
        setMessage('Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập.');
        setForgotPassword(false);
        setOtpSent(false);
      } else {
        setMessage('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
      }
    } catch (error) {
      setMessage('Lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (forgotPassword) {
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('/api/auth/login', formData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });

  //     if (response.status === 200) {
        
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('userRole', response.data.roles[0]);
  //       setIsAuthenticated(true);
  //       const role = response.data.roles;
  //       if (role.includes('ADMIN')) {
  //         navigate('/admin');
  //       } else if (role.includes('OWNER')) {
  //         navigate('/owner');
  //       } else if (role.includes('USER')) {
  //         navigate('/user');
  //       } else if (role.includes('MODERATOR')) {
  //         navigate('/moderator');
  //       } else {
  //         setMessage('Vai trò không hợp lệ!');
  //       }
  //     } else {
  //       setMessage('Đăng nhập thất bại!');
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       setMessage('Tài khoản hoặc mật khẩu không chính xác.');
  //     } else if (error.response && error.response.status === 500) {
  //       setMessage('Lỗi máy chủ. Vui lòng thử lại sau.');
  //     } else {
  //       setMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forgotPassword) {
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.roles[0]);
        setIsAuthenticated(true);
        const role = response.data.roles[0]; // Lấy vai trò của người dùng
  
        // Điều hướng đến trang cụ thể dựa trên vai trò
        if (role === 'ADMIN') {
          navigate('/managevehicles'); // Điều hướng đến quản lý xe cho admin
        } else if (role === 'OWNER') {
          navigate('/owner'); // Điều hướng đến trang "Xe của tôi" cho owner
        } else if (role === 'USER') {
          navigate('/myvehicles'); // Điều hướng đến trạng thái bãi xe cho user
        } else if (role === 'MODERATOR') {
          navigate('/moderator'); // Điều hướng đến trang xác nhận xe cho moderator
        } else {
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
      <h2>{forgotPassword ? 'Đặt Lại Mật Khẩu' : 'Đăng Nhập'}</h2>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      {!forgotPassword ? (
        <>
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
          <p className="forgot-password-link" onClick={handleForgotPassword}>
            Quên mật khẩu?
          </p>
          <input type="submit" value="Đăng Nhập" className="buttondn" />
         
        </>
      ) : otpSent ? (
        <>
         <label>
      Mật khẩu mới:
      <div className="password-field">
        <input
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="password-input"
        />
        <span className="eye-icon" onClick={() => setShowNewPassword((prev) => !prev)}>
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </label>
    <label>
      Nhập lại mật khẩu:
      <div className="password-field">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="password-input"
        />
        <span className="eye-icon" onClick={() => setShowConfirmPassword((prev) => !prev)}>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </label>
    <label>
      Nhập OTP:
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
    </label>
    <button type="button" className="buttondn" onClick={handleResetPassword}>
      Xác Nhận Đổi Mật Khẩu
    </button>
    {/* Nút Gửi lại OTP */}
    <button type="button" className="buttongtotp" onClick={handleSendOtp}>
         Gửi lại OTP
    </button>
  </>
) : (
  <button type="button" className="buttondn" onClick={handleSendOtp}>
    Gửi OTP
  </button>
)}
      <p>{message}</p>
    </form>
  );
};

export default LoginForm;

