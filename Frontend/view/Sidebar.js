import React,{ useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/App.css';

const Sidebar = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Trạng thái mở/đóng sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đảo trạng thái mở/đóng
  };
  return (

    <>
    {/* Nút toggle để mở/đóng sidebar */}
    {/* <button className="sidebar-toggle" onClick={toggleSidebar}>
      {isSidebarOpen ? '✖' : '☰'}
    </button> */}

    {/* <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}> */}
    <div className={`sidebar`}>
      <h2>{role === 'ADMIN' ? 'Quản lý Xe Chung Cư' : 'Quản lý Xe Cá Nhân'}</h2> {/* Thay đổi tiêu đề dựa vào role */}
      <ul>
        {/* <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Tổng Quan</NavLink></li> */}
       
        <li><NavLink to="/parkingmap" className={({ isActive }) => isActive ? "active" : ""}>Sơ Đồ Bãi Đỗ</NavLink></li>
       


        {role === 'ADMIN' && (
          <>
            <li><NavLink to="/parkingstatus" className={({ isActive }) => isActive ? "active" : ""}>Trạng Thái Bãi Xe</NavLink></li>
           <li><NavLink to="/parkingadminservice" className={({ isActive }) => isActive ? "active" : ""}>Dịch Vụ Bãi Đỗ</NavLink></li>
           <li><NavLink to="/invoice" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Hoá Đơn</NavLink></li>
            <li><NavLink to="/managevehiclesandusers" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Xe và Người Dùng </NavLink></li>
            <li><NavLink to="/vehiclehistory" className={({ isActive }) => isActive ? "active" : ""}>Camera Xe Ra Vào</NavLink></li>
            <li><NavLink to="/allvehiclehistory" className={({ isActive }) => isActive ? "active" : ""}>Lịch Sử Xe Ra Vào</NavLink></li>
          
            {/* <li><NavLink to="/manageusers" className={({ isActive }) => isActive ? "active" : ""}>Quản Lý Người Dùng</NavLink></li> */}
            <li><NavLink to="/approvevehicles" className={({ isActive }) => isActive ? "active" : ""}>Xác Nhận Xe</NavLink></li>
          </>
        )}

        {role === 'USER' && (
          <> 
               <li><NavLink to="/myparkingstatus" className={({ isActive }) => isActive ? "active" : ""}>Trạng Thái Bãi Xe Của Tôi</NavLink></li>
          <li><NavLink to="/parkinguserservice" className={({ isActive }) => isActive ? "active" : ""}>Dịch Vụ Đăng Ký Bãi Đỗ</NavLink></li>
          <li><NavLink to="/myinvoice" className={({ isActive }) => isActive ? "active" : ""}>Hoá Đơn Của Tôi</NavLink></li>
            <li><NavLink to="/addvehicle" className={({ isActive }) => isActive ? "active" : ""}>Thêm Thông Tin Xe</NavLink></li>
            <li><NavLink to="/myvehiclehistory" className={({ isActive }) => isActive ? "active" : ""}>Lịch Sử Xe Ra Vào Của Tôi</NavLink></li>
            <li><NavLink to="/userprofile" className={({ isActive }) => isActive ? "active" : ""}>Thông tin của Tôi</NavLink></li>
          </>
        )}
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
