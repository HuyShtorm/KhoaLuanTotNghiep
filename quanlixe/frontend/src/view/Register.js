import React, { useState } from 'react';
import axios from 'axios'; // Để gửi yêu cầu HTTP
import '../css/App.css'; // CSS đã có sẵn
import { useNavigate } from 'react-router-dom'; // Để chuyển trang

const RegisterForm = () => {
  // State để lưu trữ giá trị form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // State để lưu trữ thông báo lỗi hoặc thành công
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState(''); // Lưu trữ OTP nhập từ người dùng
  const [isOtpSent, setIsOtpSent] = useState(false); // Trạng thái hiển thị form OTP
  const [isSuccess, setIsSuccess] = useState(false); // Trạng thái hiển thị thông báo thành công
  const [timer, setTimer] = useState(60); // Đồng hồ đếm ngược cho OTP
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Trạng thái cho nút gửi lại OTP

  // Sử dụng useNavigate để chuyển trang
  const navigate = useNavigate();

  // Đếm ngược cho việc gửi lại OTP
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

  // Hàm để xử lý thay đổi khi người dùng nhập vào form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang
  
    // Kiểm tra các trường có bị bỏ trống không
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setMessage('Có thông tin còn để trống!');
      return;
    }
  
    // Kiểm tra ràng buộc tên (tối thiểu 3 ký tự)
    if (formData.name.length < 3) {
      setMessage('Tên phải có ít nhất 3 ký tự!');
      return;
    }
  
    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setMessage('Email không hợp lệ!');
      return;
    }
  
    // Kiểm tra định dạng số điện thoại (chỉ chứa số và có độ dài từ 10 đến 11 ký tự)
    const phonePattern = /^[0-9]{10,11}$/;
    if (!phonePattern.test(formData.phone)) {
      setMessage('Số điện thoại không hợp lệ! Phải có 10-11 số.');
      return;
    }

    // Kiểm tra ràng buộc mật khẩu (phải có ít nhất 1 chữ in hoa và độ dài tối thiểu 8 ký tự)
    const passwordPattern = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      setMessage('Mật khẩu phải có ít nhất 1 chữ in hoa và dài tối thiểu 8 ký tự.');
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setMessage('Mật khẩu không khớp!');
      return;
    }

    try {
      // Gửi yêu cầu đăng ký và gửi OTP qua API
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setIsOtpSent(true); // Hiển thị form OTP sau khi gửi thành công
      setMessage('OTP đã được gửi tới email của bạn.');
      setTimer(60); // Đặt lại bộ đếm khi gửi OTP mới
      setIsResendDisabled(true); // Vô hiệu hóa nút gửi lại OTP trong thời gian chờ
    } catch (error) {
      setMessage('Đăng ký thất bại: ' + (error.response?.data.message || 'Lỗi không xác định'));
    }
  };


  // Hàm xử lý khi người dùng nhấn nút "Xác nhận OTP"
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const otpRequest = {
        email: formData.email,
        otp: otp,
      };
      // Gửi OTP và xác nhận qua API
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', otpRequest);
      setMessage('Xác thực thành công, tài khoản đã được tạo!');
      setIsSuccess(true); // Sau khi thành công, có thể chuyển qua trang đăng nhập
    } catch (error) {
      setMessage('Xác thực OTP thất bại: ' + (error.response?.data || 'Lỗi không xác định'));
    }
  };

  // Hàm xử lý gửi lại OTP
  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/resend-otp', { email: formData.email });
      setMessage('OTP mới đã được gửi lại tới email của bạn.');
      setTimer(60); // Đặt lại bộ đếm khi gửi OTP mới
      setIsResendDisabled(true); // Vô hiệu hóa nút gửi lại OTP trong thời gian chờ
    } catch (error) {
      setMessage('Gửi lại OTP thất bại: ' + (error.response?.data || 'Lỗi không xác định'));
    }
  };

  // Hàm xử lý khi người dùng nhấn nút "Xác nhận" để chuyển sang trang đăng nhập
  const handleConfirm = () => {
    navigate('/login'); // Chuyển sang form đăng nhập
  };

  return (
    <div className="form-container">
      {/* Hiển thị thông báo */}
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
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Mật khẩu:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <label>
            Nhập lại mật khẩu:
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
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
