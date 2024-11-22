import React from 'react';
import backgroundImage from '../img/anhnentrangchu.jpg'; // Ảnh nền cục bộ
import '../css/App.css';

const Home = () => {
  return (
    <div>
      <img src={backgroundImage} className="App-background-image" alt="background" />
      <div className="App-content">
        <div className="welcome-text">
          Chào mừng đến với hệ thống quản lý xe chung cư
        </div>
        <div className="animated-images">
          {/* Sử dụng URL trực tiếp cho hình ảnh
          <img 
            src="https://kenh14cdn.com/2020/10/23/photo-1-16034329264641278867917.jpg" 
            alt="Ảnh 1" 
          />
           <img 
            src="https://megaparking.vn/wp-content/uploads/2018/12/giai-phap-quan-ly-xe-chung-cu.jpg" 
            alt="Ảnh 2" 
          /> */}
          {/* <img 
            src="https://image.plo.vn/w1000/Uploaded/2024/ovhpaov/2023_03_11/z4173394877779-bcbde8851eee33a6f11c72037e7a09ad-4288.jpg.webp" 
            alt="Ảnh 3" 
          /> */}
          
        </div>
      </div>
    </div>
  );
};

export default Home;
