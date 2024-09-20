import React, { useState } from 'react';
import axios from 'axios'; // Thêm axios để gửi yêu cầu HTTP
import '../css/App.css';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển trang

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
  const [isSuccess, setIsSuccess] = useState(false);

  // Sử dụng useNavigate để chuyển trang
  const navigate = useNavigate();

  // Hàm để xử lý thay đổi khi người dùng nhập vào form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm để xử lý khi người dùng nhấn nút "Đăng Ký"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang
  
    // Kiểm tra các trường có bị bỏ trống không
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setMessage('Có thông tin còn để trống !');
      return;
    }
  
    // Kiểm tra ràng buộc tên (tối thiểu 3 ký tự)
    if (formData.name.length < 10) {
      setMessage('Tên phải có ít nhất 10 ký tự!');
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
      // Gửi dữ liệu đăng ký đến backend qua API
      const response = await axios.post('http://localhost:8080/api/auth/register', formData);
      setIsSuccess(true); // Đặt trạng thái thành công
      setMessage('Đăng ký thành công!');
    } catch (error) {
      setMessage('Đăng ký thất bại: ' + (error.response?.data.message || 'Lỗi không xác định'));
    }
  };
  

  // Hàm xử lý khi người dùng nhấn nút "Xác nhận"
  const handleConfirm = () => {
    navigate('/'); // Chuyển về trang chủ
  };

  return (
    <div className="form-container">
      {/* Hiển thị thông báo */}
      {message && (
        <div className="message-overlay">
          <div className="message-box">
            <p>{message}</p>
            {isSuccess ? (
              <button onClick={handleConfirm}>Xác nhận</button>
            ) : (
              <button onClick={() => setMessage('')}>Đóng</button>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default RegisterForm;
