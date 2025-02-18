import React from 'react';
import '../css/Infor.css';

const Infor = () => {
  return (
    <div className="infor-container">
      <div className="infor-header">Hệ Thống Quản Lý Xe Chung Cư</div>
      <div className="infor-description">
        Chào mừng bạn đến với hệ thống quản lý xe chung cư thông minh, giúp bạn dễ dàng quản lý và theo dõi việc đỗ xe trong khu chung cư.
    
      </div>
      <div className="infor-description">
       
        Với giao diện thân thiện, bạn có thể kiểm soát tình trạng bãi xe, sắp xếp chỗ đỗ, và đảm bảo an ninh tối đa cho cư dân. 
        Hệ thống còn hỗ trợ tích hợp với camera an ninh và các thiết bị kiểm soát ra vào, mang đến sự tiện lợi và an toàn cho mọi cư dân.
      </div>

      <div className="image-gallery">
        <div className="image-item">
          <img src="https://eparking.vn/wp-content/uploads/2024/03/tieu-chuan-bai-dau-xe-chung-cu.jpg" alt="Bãi đỗ xe hiện đại" />
          <div className="image-caption">Bãi đỗ xe hiện đại</div>
        </div>
        <div className="image-item">
          <img src="https://huecamera.com/wp-content/uploads/2023/12/mo-hinh-1may-3lan-1-1.jpg" alt="Camera giám sát" />
          <div className="image-caption">Camera giám sát</div>
        </div>
        <div className="image-item">
          <img src="https://baogiaothong.mediacdn.vn/upload/images/2022-4/article_img/2022-10-25/img-bgt-2021-mo-phong-mot-bai-do-nhieu-tang-tai-nhat-ban-1666661659-width1280height825.jpg" alt="Quản lý thông minh" />
          <div className="image-caption">Quản lý thông minh</div>
        </div>
      </div>
      
    </div>
  );
};

export default Infor;
