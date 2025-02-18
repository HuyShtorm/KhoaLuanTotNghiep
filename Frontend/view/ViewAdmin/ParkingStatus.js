import React from 'react';
import '../../css/ParkingStatus.css'; // Import file CSS

function Parkingstatus() {
  const zonesData = {
    'Khu A': {
      type: 'CAR',
      floors: {
        'Tầng 1': { totalSlots: 20, cameraUrl: 'https://192.168.1.191:8080/video' },
        'Tầng 2': { totalSlots: 15, cameraUrl: 'https://192.168.1.192:8080/video' },
        'Hầm B1': { totalSlots: 25, cameraUrl: 'https://192.168.1.193:8080/video' },
      },
    },
    'Khu B': {
      type: 'MOTORBIKE',
      floors: {
        'Tầng 1': { totalSlots: 30, cameraUrl: 'https://192.168.1.191:8080/video' },
        'Tầng 2': { totalSlots: 25, cameraUrl: 'https://192.168.2.192:8080/video' },
        'Tầng 3': { totalSlots: 20, cameraUrl: 'https://192.168.2.193:8080/video' },
        'Hầm B1': { totalSlots: 35, cameraUrl: 'https://192.168.2.194:8080/video' },
      },
    },
    'Khu C': {
      type: 'BICYCLE',
      floors: {
        'Tầng Trệt': { totalSlots: 50, cameraUrl: 'https://192.168.3.191:8080/video' },
      },
    },
  };

  return (
    <div className="parking-status-container">
      <h1 className="parking-status-title">Bãi Đỗ Xe</h1>
      {Object.entries(zonesData).map(([zoneName, zoneData]) => (
        <div key={zoneName} className="zone-section">
          <h2>{zoneName} - {zoneData.type === 'CAR' ? 'Ô tô' : zoneData.type === 'MOTORBIKE' ? 'Xe máy' : 'Xe đạp'}</h2>
          {Object.entries(zoneData.floors).map(([floorName, floorData]) => (
            <div key={floorName} className="floor-section">
              <h3>{floorName}</h3>
              <div className="videos-grid">
                <div className="video-wrapper">
                  <iframe
                    src={floorData.cameraUrl}
                    className="parking-status-video"
                    title={`Camera tại ${zoneName} - ${floorName}`}
                  />
                  <p className="camera-title">{`Camera tại ${zoneName} - ${floorName}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Parkingstatus;
