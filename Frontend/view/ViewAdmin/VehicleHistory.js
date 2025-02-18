import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const VehicleHistory = () => {
    const [approvedVehicles, setApprovedVehicles] = useState([]);
const [selectedVehicleId, setSelectedVehicleId] = useState("");
const [image, setImage] = useState(null);
const webcamRef = React.useRef(null);

const token = localStorage.getItem("token"); // Lấy token từ localStorage

useEffect(() => {
    const fetchApprovedVehicles = async () => {
        try {
            const response = await axios.get("/api/vehicle-history/approved", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setApprovedVehicles(response.data);
        } catch (error) {
            console.error("Error fetching approved vehicles:", error);
        }
    };

    fetchApprovedVehicles();
}, []);

// Chụp ảnh
const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
}, [webcamRef]);

// Gửi lịch sử xe
const saveVehicleHistory = async (action) => {
    if (!selectedVehicleId) {
        alert("Vui lòng chọn xe.");
        return;
    }

    if (image) {
        const formData = new FormData();
        const blob = await fetch(image).then((res) => res.blob());
        formData.append("file", blob, "capture.jpg");
        formData.append("vehicleId", selectedVehicleId); // ID xe đã chọn
        formData.append("action", action); // Hành động (entry/exit)

        console.log("FormData being sent:", formData);

        try {
            await axios.post("/api/vehicle-history/entry-exit", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert(`Đã ghi nhận xe ${action === "entry" ? "vào" : "ra"}.`);
        } catch (error) {
            console.error("Error saving vehicle history:", error.response.data);
        }
    } else {
        alert("Chưa chụp ảnh để tải lên.");
    }
};


return (
    <div>
        <h2>Quản lý Lịch sử Xe</h2>

        {/* Hiển thị Webcam */}
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: "100%", height: "300px", marginBottom: "20px" }}
        />
        <button onClick={capture}>Chụp ảnh</button>
        {image && <img src={image} alt="Captured" style={{ width: "300px", margin: "10px 0" }} />}

        {/* Chọn xe */}
        <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
            <option value="">Chọn xe</option>
            {approvedVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.type}
                </option>
            ))}
        </select>

        <button onClick={() => saveVehicleHistory("entry")}>Xe vào</button>
        <button onClick={() => saveVehicleHistory("exit")}>Xe ra</button>
    </div>
);
};

export default VehicleHistory;
