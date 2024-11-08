import React from 'react';
import '../../css/MyParkingStatus.css'; // Import file CSS

function MyParkingStatus() {
  return (
    <div className="parking-status-container">
      <h1 className="parking-status-title">My Parking Status</h1>
      <div className="video-wrapper">
        <iframe
          src="http://192.168.1.191:8080/video" /* URL của luồng video webcam */
          className="parking-status-video"
          title="Camera Stream"
        />
      </div>
    </div>
  );
}

export default MyParkingStatus;
