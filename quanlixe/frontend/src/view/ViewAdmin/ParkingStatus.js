import React from 'react';
import '../../css/ParkingStatus.css'; // Import file CSS

function Parkingstatus() {
  const cameraUrls = [
    'http://192.168.1.191:8080/video',
    'http://192.168.1.192:8080/video',
    'http://192.168.1.193:8080/video',
    'http://192.168.1.194:8080/video',
    'http://192.168.1.195:8080/video',
    'http://192.168.1.196:8080/video',
    'http://192.168.1.197:8080/video',
    'http://192.168.1.198:8080/video',
  ];

  return (
    <div className="parking-status-container">
      <h1 className="parking-status-title">My Parking Status</h1>
      <div className="videos-grid">
        {cameraUrls.map((url, index) => (
          <div className="video-wrapper" key={index}>
            <iframe
              src={url}
              className="parking-status-video"
              title={`Camera Stream ${index + 1}`}
            />
            <p className="camera-title">Bãi đỗ {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Parkingstatus;
