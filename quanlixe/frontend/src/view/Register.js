import React, { useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icon con mắt

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    const { name, email, password, confirmPassword, phone } = formData;

    if (!name || !email || !password || !confirmPassword || !phone) {
      setMessage('Có thông tin còn để trống!');
      return false;
    }

    if (name.length < 10) {
      setMessage('Tên phải có ít nhất 10 ký tự.');
      return false;
    }

    // Kiểm tra định dạng email và kiểm tra đuôi .com
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Định dạng email không hợp lệ.');
      return false;
    }

    if (!email.endsWith('.com')) {
      setMessage('Email phải kết thúc bằng ".com".');
      return false;
    }

    // Kiểm tra mật khẩu
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordPattern.test(password)) {
      setMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ in hoa, 1 ký tự đặc biệt và 1 chữ số.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      return false;
    }

    // Kiểm tra số điện thoại (bắt đầu bằng 0, có độ dài 10-11 ký tự)
    const phonePattern = /^0\d{9,10}$/;
    if (!phonePattern.test(phone)) {
      setMessage('Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và có 10-11 số.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setIsOtpSent(true);
      setMessage('OTP đã được gửi tới email của bạn.');
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('Email đã tồn tại. Vui lòng sử dụng email khác.');
      } else if (error.response && error.response.status === 500) {
        setMessage('Có lỗi xảy ra trên server. Vui lòng thử lại sau.');
      } else {
        setMessage('Đăng ký thất bại: ' + (error.response?.data.message || 'Lỗi không xác định'));
      }
    }
  };
  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const otpRequest = {
        email: formData.email,
        otp: otp,
      };
      await axios.post('http://localhost:8080/api/auth/verify-otp', otpRequest);
      setMessage('Xác thực thành công, tài khoản đã được tạo!');
      setIsSuccess(true);
    } catch (error) {
      setMessage('Xác thực OTP thất bại: ' + (error.response?.data || 'Lỗi không xác định'));
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/resend-otp', { email: formData.email });
      setMessage('OTP mới đã được gửi lại tới email của bạn.');
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      setMessage('Gửi lại OTP thất bại: ' + (error.response?.data || 'Lỗi không xác định'));
    }
  };

  const handleConfirm = () => {
    navigate('/login');
  };

  return (
    <div className="form-container">
      {message && (
        <div className="message-overlay">
          <div className="message-box">
            <p>{message}</p>
            {isSuccess ? (
              <button onClick={handleConfirm}>Chuyển đến đăng nhập</button>
            ) : (
              <button onClick={() => setMessage('')}>Đóng</button>
            )}
          </div>
        </div>
      )}

      {!isOtpSent ? (
        <form className="Register-form" onSubmit={handleSubmit}>
          <h2>Đăng Ký</h2>
          <label>
            Họ và Tên:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
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
          <label>
            Nhập lại mật khẩu:
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="password-input"
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          <label>
            Số Điện Thoại:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <button type="submit">Đăng Ký</button>
        </form>
      ) : (
        <form className="Otp-form" onSubmit={handleOtpSubmit}>
          <h2>Nhập Mã OTP</h2>
          <p>Mã OTP đã được gửi tới email của bạn. Vui lòng kiểm tra và nhập mã OTP để xác thực.</p>
          <label>
            OTP:
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </label>
          <button type="submit">Xác Nhận</button>
          <button type="button" onClick={handleResendOtp} disabled={isResendDisabled}>
            Gửi lại OTP {isResendDisabled && `(${timer}s)`}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
