// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../css/ParkingServiceUser.css'; // Import CSS file

// function ParkingServiceUser() {
//     const [services, setServices] = useState([]);
//     const [vehicles, setVehicles] = useState([]);
//     const [selectedService, setSelectedService] = useState(null);
//     const [filteredVehicles, setFilteredVehicles] = useState([]);
//     const [selectedVehicle, setSelectedVehicle] = useState(null);
//     const [subscriptionDetails, setSubscriptionDetails] = useState({
//         startDate: '',
//         endDate: ''
//     });
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [modalMessage, setModalMessage] = useState('');

//     useEffect(() => {
//         const fetchServices = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get('/api/users/parking-services', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setServices(response.data);
//             } catch (error) {
//                 console.error('Error fetching services:', error);
//                 showAlert('Failed to load services.');
//             }
//         };

//         const fetchVehicles = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get('/api/users/vehicles', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setVehicles(response.data);
//             } catch (error) {
//                 console.error('Error fetching vehicles:', error);
//                 showAlert('Failed to load vehicles.');
//             }
//         };

//         fetchServices();
//         fetchVehicles();
//     }, []);

//     const handleSelectService = (serviceId, applicableType, durationMonths) => {
//         setSelectedService(serviceId);
//         const filtered = vehicles.filter(vehicle => vehicle.type === applicableType);
//         setFilteredVehicles(filtered);

//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + durationMonths);

//         setSubscriptionDetails({
//             startDate: startDate.toISOString().split('T')[0],
//             endDate: endDate.toISOString().split('T')[0]
//         });
//     };

//     const showAlert = (message) => {
//         setModalMessage(message);
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setModalMessage('');
//     };

//     const handleSubscribe = async () => {
//         if (!selectedVehicle) {
//             showAlert('Please select a vehicle first.');
//             return;
//         }

//         const token = localStorage.getItem('token');
//         try {
//             await axios.post(
//                 `/api/users/subscribe-service/${selectedService}?vehicleId=${selectedVehicle}`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             showAlert(`Đăng ký dịch vụ thành công`);
//         } catch (error) {
//             showAlert(`Đăng ký dịch vụ thất bại `);
//         }
//     };

//     const filteredServices = services.filter(service =>
//         service.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="parking-service-container">
//             <h2>Dịch Vụ Bãi Đỗ Xe Có Sẵn</h2>
//             {showModal && (
//                 <>
//                     <div className="modal-overlay" onClick={closeModal}></div>
//                     <div className="modal">
//                         <p>{modalMessage}</p>
//                         <button onClick={closeModal}>Close</button>
//                     </div>
//                 </>
//             )}
//             <input
//                 type="text"
//                 placeholder="Tìm Dịch Vụ..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//             />
//             <div className="service-grid">
//                 {filteredServices.map((service) => (
//                     <div key={service.id} className="service-card">
//                         <h4>{service.name}</h4>
//                         <p>Chi Phí: ${service.price}</p>
//                         <p>Thời Hạn: {service.durationMonths} Tháng</p>
//                         <p>Áp Dụng Cho :  
//                         {service.applicableType === "MOTORBIKE" ? "  Xe máy" : 
//                         service.applicableType === "CAR" ? "  Ô tô" : " Xe đạp"}
//                         </p>
//                         <button
//                             className="select-button"
//                             onClick={() => handleSelectService(service.id, service.applicableType, service.durationMonths)}
//                         >
//                            Chọn Dịch Vụ
//                         </button>
//                         {selectedService === service.id && (
//                             <div>
//                                 <h4>Chọn Xe của bạn</h4>
//                                 {filteredVehicles.length > 0 ? (
//                                     <select
//                                         onChange={(e) => setSelectedVehicle(e.target.value)}
//                                         className="vehicle-select"
//                                     >
//                                         <option value="">-- Chọn Xe Đã Xác Nhận --</option>
//                                         {filteredVehicles.map((vehicle) => (
//                                             <option key={vehicle.id} value={vehicle.id}>
//                                                 {vehicle.licensePlate} ({vehicle.applicableType === "MOTORBIKE" ? "  Xe máy" : 
//                         vehicle.applicableType === "CAR" ? "  Ô tô" : " Xe đạp"})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 ) : (
//                                     <p>No vehicles available for this service type.</p>
//                                 )}

//                                 {selectedVehicle && (
//                                     <div>
//                                         <h4>Thời Gian Dịch Vụ</h4>
//                                         <p>Ngày Bắt Đầu: {subscriptionDetails.startDate}</p>
//                                         <p>Ngày Kết Thúc: {subscriptionDetails.endDate}</p>
//                                         <button className="confirm-button" onClick={handleSubscribe}>
//                                            Xác Nhận
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default ParkingServiceUser;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/ParkingServiceUser.css'; // Import CSS file

function ParkingServiceUser() {
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [subscribedServices, setSubscribedServices] = useState([]);

    const [subscriptionDetails, setSubscriptionDetails] = useState({
        startDate: '',
        endDate: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/users/parking-services', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                showAlert('Failed to load services.');
            }
        };

        const fetchVehicles = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/users/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                showAlert('Failed to load vehicles.');
            }
        };
    
            const fetchRegisteredServices = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get('/api/users/registered-services', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Registered Services Response:", response.data); // Kiểm tra dữ liệu trả về
                    setSubscribedServices(response.data); // Lưu danh sách dịch vụ đã đăng ký
                } catch (error) {
                    console.error('Error fetching registered services:', error);
                    showAlert('Failed to load registered services.');
                }
            };
           
        
        

        fetchServices();
        fetchVehicles();
        fetchRegisteredServices();
    }, []);
  
    
    const handleSelectService = (serviceId, applicableType, durationMonths) => {
        setSelectedService(serviceId);

        // Lọc danh sách xe theo loại xe áp dụng
        const filtered = vehicles.filter(vehicle => 
            vehicle.type.toUpperCase() === applicableType.toUpperCase()
        );
        setFilteredVehicles(filtered);

        // Tính toán thời gian dịch vụ
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);

        setSubscriptionDetails({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    };

    const showAlert = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    const handleSubscribe = async () => {
        if (!selectedVehicle) {
            showAlert('Please select a vehicle first.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `/api/users/subscribe-service/${selectedService}?vehicleId=${selectedVehicle}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showAlert(`Đăng ký dịch vụ thành công`);
        } catch (error) {
            showAlert(`Đăng ký dịch vụ thất bại `);
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="parking-service-container">
            <h2>Dịch Vụ Bãi Đỗ Xe Có Sẵn</h2>
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={closeModal}></div>
                    <div className="modal">
                        <p>{modalMessage}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </>
            )}
            <input
                type="text"
                placeholder="Tìm Dịch Vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <div className="service-grid">
                {filteredServices.map((service) => (
                    <div key={service.id} className="service-card">
                        <h4>{service.name}</h4>
                        <p>Chi Phí: ${service.price}</p>
                        <p>Thời Hạn: {service.durationMonths} Tháng</p>
                        <p>Áp Dụng Cho :  
                        {service.applicableType === "MOTORBIKE" ? "  Xe máy" : 
                        service.applicableType === "CAR" ? "  Ô tô" : " Xe đạp"}
                        </p>
                        <p>Khu: {service.zone || 'Chưa xác định'}</p>
    <p>Tầng: {service.floor || 'Chưa xác định'}</p>
    <p>Vị trí: {service.slotNumber || 'Chưa xác định'}</p>
    <p>Camera: {service.cameraUrl ? <a href={service.cameraUrl} target="_blank" rel="noopener noreferrer">Xem Camera</a> : 'Chưa có camera'}</p>
    <p>Mô Tải : {service.description||'không có mô tả'}</p>
                        <button
                            className="select-button"
                            onClick={() => handleSelectService(service.id, service.applicableType, service.durationMonths)}
                        >
                           Chọn Dịch Vụ
                        </button>
                        {selectedService === service.id && (
                            <div>
                                <h4>Chọn Xe của bạn</h4>
                                {filteredVehicles.length > 0 ? (
                                    <select
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                        className="vehicle-select"
                                    >
                                        <option value="">-- Chọn Xe Đã Xác Nhận --</option>
                                        {filteredVehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.licensePlate} ({vehicle.type === "MOTORBIKE" ? "Xe máy" : vehicle.type === "CAR" ? "Ô tô" : "Xe đạp"})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p>Không có xe phù hợp với loại dịch vụ này.</p>
                                )}

                                {selectedVehicle && (
                                    <div>
                                        <h4>Thời Gian Dịch Vụ</h4>
                                        <p>Ngày Bắt Đầu: {subscriptionDetails.startDate}</p>
                                        <p>Ngày Kết Thúc: {subscriptionDetails.endDate}</p>
                                        <button className="confirm-button" onClick={handleSubscribe}>
                                           Xác Nhận
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <h3>Các Dịch Vụ Đã Đăng Ký</h3>
<ul className="service-list">
    {subscribedServices.map((service, index) => (
        <li key={index} className="service-item">
            <h4>
                {service.parkingService.name} (
                {service.parkingService.applicableType === "MOTORBIKE" ? "Xe máy" :
                 service.parkingService.applicableType === "CAR" ? "Ô tô" : "Xe đạp"})
            </h4>
            <p>Giá: {service.parkingService.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            <p>Khu: {service.parkingService.zone || 'Chưa xác định'}</p>
            <p>Ngày bắt đầu: {new Date(service.startDate).toLocaleDateString('vi-VN')}</p>
            <p>Ngày kết thúc: {new Date(service.endDate).toLocaleDateString('vi-VN')}</p>
        </li>
    ))}
</ul>


        </div>
    );
}

export default ParkingServiceUser;
