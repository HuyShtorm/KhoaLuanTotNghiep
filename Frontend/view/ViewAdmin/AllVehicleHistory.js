import React, { useState, useEffect } from "react";
import axios from "axios";

const AllVehicleHistory = () => {
    const [historyList, setHistoryList] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("/api/vehicle-history/entry-exit-history", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("History response:", response.data);
                setHistoryList(response.data);
            } catch (error) {
                console.error("Error fetching vehicle history:", error);
            }
        };
    
        fetchHistory();
    }, []);
    

    return (
        <div>
            <h2>Lịch sử Ra/Vào Xe</h2>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Biển số</th>
                        <th>Hành động</th>
                        <th>Thời gian</th>
                        <th>Ảnh</th>
                    </tr>
                </thead>
                <tbody>
    {historyList.map((history, index) => (
        <tr key={index}>
            <td>{history.licensePlate || "Không xác định"}</td>
            <td>{history.action === "entry" ? "Vào" : "Ra"}</td>
            <td>{new Date(history.timestamp).toLocaleString()}</td>
            <td>
                {history.imageUrl ? (
                    <img
                        src={history.imageUrl}
                        alt="Hình ảnh ra vào"
                        style={{ width: "100px", height: "60px" }}
                    />
                ) : (
                    "Không có ảnh"
                )}
            </td>
        </tr>
    ))}
</tbody>

            </table>
        </div>
    );
};

export default AllVehicleHistory;
