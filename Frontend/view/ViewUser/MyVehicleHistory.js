import React, { useEffect, useState } from "react";
import axios from "axios";

function MyVehicleHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchMyVehicleHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/vehicle-history/my-entry-exit-history", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("My Vehicle History:", response.data);
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching vehicle entry/exit history:", error);
            }
        };

        fetchMyVehicleHistory();
    }, []);

    return (
        <div>
            <h2>Lịch sử Ra/Vào Xe của Tôi</h2>
            <table>
                <thead>
                    <tr>
                        <th>Biển số</th>
                        <th>Hành động</th>
                        <th>Thời gian</th>
                        <th>Ảnh</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.licensePlate}</td>
                            <td>{entry.action === "entry" ? "Vào" : "Ra"}</td>
                            <td>
    {entry.timestamp
        ? new Date(
              entry.timestamp[0], // Năm
              entry.timestamp[1] - 1, // Tháng (bắt đầu từ 0)
              entry.timestamp[2], // Ngày
              entry.timestamp[3], // Giờ
              entry.timestamp[4], // Phút
              entry.timestamp[5] // Giây
          ).toLocaleString()
        : "Không xác định"}
</td>

                            <td>
                                <img
                                    src={entry.imageUrl}
                                    alt="Vehicle action"
                                    style={{ width: "100px" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyVehicleHistory;
