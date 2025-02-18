import React, { useState } from 'react';
import '../css/Parkingmap.css'; // Import CSS để thêm style

function Parkingmap() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const sections = [
    { title: 'Khu A', images: ['https://iuh.edu.vn/Resource/Upload2/Image/2024/07/iuh-image001.jpg', 'https://kiemtruong.vn/upload/hinhbaiviet/images/2020/Thang-07/22-07/220720_4849_1.jpg', 'https://iuh.edu.vn/Resource/Upload2/_thumbs/Image/2018/06/intro_iuh_2018.jpg','https://iuh.edu.vn/Resource/Upload2/Image/2022/09/image006.jpg'] },
    { title: 'Khu B', images: ['https://cdnphoto.dantri.com.vn/8-XBZG5AI4M1m7xYgreoNH6JUhw=/thumb_w/1020/2024/04/16/baiguixe-edited-1713255791018.jpeg', 'b2.jpg', 'b3.jpg'] },
    { title: 'Khu C', images: ['https://iuh.edu.vn/Resource/Upload2/Image/2022/09/image006.jpg', 'c2.jpg', 'c3.jpg'] },
  ];

  return (
    <div className="parking-map">
      {sections.map((section, index) => (
        <div key={index} className="section">
          <h2>{section.title}</h2>
          <div className="main-image">
            <img
              src={section.images[0]}
              alt={`${section.title} main`}
              onClick={() => handleImageClick(section.images[0])}
            />
          </div>
          <div className="thumbnail-row">
            {section.images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${section.title} thumbnail ${idx + 1}`}
                className="thumbnail"
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
      ))}
      {selectedImage && (
        <div className="image-viewer" onClick={closeImageViewer}>
          <img src={selectedImage} alt="Selected" />
          <span className="close-button" onClick={closeImageViewer}>
            ×
          </span>
        </div>
      )}
    </div>
  );
}

export default Parkingmap;
// import a1 from './images/a1.jpg';
// import a2 from './images/a2.jpg';
// import a3 from './images/a3.jpg';
// import b1 from './images/b1.jpg';
// import b2 from './images/b2.jpg';
// import b3 from './images/b3.jpg';
// import c1 from './images/c1.jpg';
// import c2 from './images/c2.jpg';
// import c3 from './images/c3.jpg';

// const sections = [
//   { title: 'Khu A', images: [a1, a2, a3] },
//   { title: 'Khu B', images: [b1, b2, b3] },
//   { title: 'Khu C', images: [c1, c2, c3] },
// ];
