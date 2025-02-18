
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/ParkingServiceAdmin.css';
import Swal from 'sweetalert2';
function ParkingServiceAdmin() {
    const [services, setServices] = useState([]);
    const [serviceRegistrations, setServiceRegistrations] = useState({});
    const [releasedServices, setReleasedServices] = useState([]);
    const [overdueServices, setOverdueServices] = useState([]);
const [expiredServices, setExpiredServices] = useState([]);
const [errors, setErrors] = useState({});


    const [newService, setNewService] = useState({
        name: '',
        price: 0,
        applicableType: 'CAR',
        zone: '',
        floor: '',
        slotNumber: '',
        cameraUrl: '',
        durationMonths: 1,
        description: '',
    });

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
    };  const validateService = () => {
        const errors = [];
        if (!newService.name.trim()) errors.push("Tên dịch vụ không được để trống.");
        if (newService.price <= 0) errors.push("Giá tiền phải lớn hơn 0.");
        if (!newService.zone) errors.push("Bạn phải chọn khu.");
        if (!newService.floor) errors.push("Bạn phải chọn tầng.");
        if (!newService.slotNumber) errors.push("Bạn phải chọn vị trí.");
        if (!newService.durationMonths || newService.durationMonths <= 0)
            errors.push("Thời gian phải lớn hơn 0 tháng.");
        if (!newService.description.trim()) errors.push("Mô tả không được để trống.");

        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi nhập liệu',
                html: `<ul>${errors.map((err) => `<li>${err}</li>`).join('')}</ul>`,
            });
            return false;
        }
        return true;
    };

    const [zones, setZones] = useState([]);
    const [floors, setFloors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [occupiedSlots, setOccupiedSlots] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/admin/parking-services', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServices(response.data);
            } catch (error) {
                console.error('Lỗi khi tải dịch vụ:', error);
                alert('Không thể tải danh sách dịch vụ.');
            }
        };

        const fetchServiceRegistrations = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/admin/service-registrations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Dữ liệu trả về từ API:", response.data); // Kiểm tra dữ liệu trả về
                const registrations = response.data.reduce((acc, registration) => {
                    const { serviceId, userName, licensePlate,gmail } = registration; // Lấy trực tiếp từ cấu trúc dữ liệu thực tế
                    if (!acc[serviceId]) {
                        acc[serviceId] = [];
                    }
                    acc[serviceId].push({ userName, licensePlate,gmail }); // Thêm thông tin vào danh sách
                    return acc;
                }, {});
                setServiceRegistrations(registrations);
            } catch (error) {
                console.error('Lỗi khi tải thông tin đăng ký:', error);
            }
        };
 
            const fetchReleasedServices = async () => {
                const token = localStorage.getItem("token");
                try {
                    const response = await axios.get("/api/admin/released-services", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setReleasedServices(response.data);
                } catch (error) {
                    console.error("Failed to fetch released services:", error);
                }
            };
            const fetchAdminServices = async () => {
                const token = localStorage.getItem("token");
                try {
                    const overdueResponse = await axios.get("/api/admin/overdue-services", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setOverdueServices(overdueResponse.data);
        
                    const expiredResponse = await axios.get("/api/admin/expired-services", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setExpiredServices(expiredResponse.data);
                } catch (error) {
                    console.error("Failed to fetch admin services:", error);
                }
            };
        
            fetchAdminServices();
        
        

        fetchServices();
        fetchServiceRegistrations();
        fetchReleasedServices();
   
    }, []);

    // Cập nhật danh sách khu dựa trên loại xe
    useEffect(() => {
        const applicableZones = Object.keys(zonesData).filter(
            (zone) => zonesData[zone].type === newService.applicableType
        );
        setZones(applicableZones);
        setNewService((prev) => ({
            ...prev,
            zone: '',
            floor: '',
            slotNumber: '',
            cameraUrl: '',
        }));
        setFloors([]);
        setSlots([]);
        setOccupiedSlots([]);
    }, [newService.applicableType]);

    // Cập nhật danh sách tầng dựa trên khu được chọn
    useEffect(() => {
        if (newService.zone) {
            const selectedZone = zonesData[newService.zone];
            const applicableFloors = Object.keys(selectedZone.floors);
            setFloors(applicableFloors);
            setNewService((prev) => ({
                ...prev,
                floor: '',
                slotNumber: '',
                cameraUrl: '',
            }));
            setSlots([]);
            setOccupiedSlots([]);
        }
    }, [newService.zone]);

    // Cập nhật danh sách vị trí và camera URL dựa trên tầng được chọn
    useEffect(() => {
        if (newService.zone && newService.floor) {
            const selectedFloor = zonesData[newService.zone]?.floors[newService.floor];
            if (selectedFloor) {
                const { totalSlots, cameraUrl } = selectedFloor;
    
                const fetchAvailableSlots = async () => {
                    const token = localStorage.getItem('token');
                    try {
                        const response = await axios.get('/api/admin/available-slots', {
                            
                            headers: {
                                Authorization: `Bearer ${token}`, // Gửi token trong header
                            },
                            params: {
                                zone: newService.zone,
                                floor: newService.floor,
                                totalSlots: totalSlots,
                            },
                        });
    
                        const availableSlots = response.data;
                        const allSlots = Array.from({ length: totalSlots }, (_, i) => i + 1);
    
                        console.log('Available Slots:', availableSlots);
                        console.log('Occupied Slots:', allSlots.filter(slot => !availableSlots.includes(slot)));
                        console.log('Camera URL:', cameraUrl);
    
                        setSlots(availableSlots);
                        setOccupiedSlots(allSlots.filter(slot => !availableSlots.includes(slot)));
                        setNewService((prev) => ({ ...prev, cameraUrl }));
                    } catch (error) {
                        console.error('Lỗi khi tải vị trí khả dụng:', error);
                    }
                };
    
                fetchAvailableSlots();
            }
        } else {
            setSlots([]);
            setOccupiedSlots([]);
            setNewService((prev) => ({ ...prev, cameraUrl: '' }));
        }
    }, [newService.zone, newService.floor]);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddService = async () => {
        if (!validateService()) return; 
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/admin/add-parking-service', newService, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices([...services, response.data]);
            
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thêm dịch vụ thành công!',
            });
    
            setNewService({
                name: '',
                price: 0,
                applicableType: 'CAR',
                zone: '',
                floor: '',
                slotNumber: '',
                cameraUrl: '',
                durationMonths: 1,
                description: '',
            });
            setErrors({});
        } catch (error) {
            console.error('Lỗi khi thêm dịch vụ:', error);
            
            // Hiển thị thông báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Thêm dịch vụ thất bại. Vui lòng thử lại.',
            });
        }
    };

    return (
        <div className="parking-service-admin">
            <h2>Quản lý Dịch vụ Bãi đỗ xe</h2>
            <h3>Thêm dịch vụ mới</h3>
           <div className="form-container">
    <label htmlFor="name">Tên dịch vụ:</label>
    <input
        id="name"
        name="name"
        value={newService.name}
        onChange={handleInputChange}
        className="form-input"
    />
    {errors.name && <p className="error-message">{errors.name}</p>}

    <label htmlFor="price">Giá tiền:</label>
    <input
        id="price"
        name="price"
        type="number"
        value={newService.price}
        onChange={handleInputChange}
        className="form-input"
    />
    {errors.price && <p className="error-message">{errors.price}</p>}

    <label htmlFor="zone">Khu:</label>
    <select
        id="zone"
        name="zone"
        value={newService.zone}
        onChange={handleInputChange}
        className="form-select"
    >
        <option value="">-- Chọn Khu --</option>
        {zones.map((zone) => (
            <option key={zone} value={zone}>
                {zone}
            </option>
        ))}
    </select>
    {errors.zone && <p className="error-message">{errors.zone}</p>}

    <label htmlFor="floor">Tầng:</label>
    <select
        id="floor"
        name="floor"
        value={newService.floor}
        onChange={handleInputChange}
        className="form-select"
    >
        <option value="">-- Chọn Tầng --</option>
        {floors.map((floor) => (
            <option key={floor} value={floor}>
                {floor}
            </option>
        ))}
    </select>
    <label htmlFor="slots">Vị trí:</label>
                    <div className="slots-container">
    {Array.from({ length: slots.length + occupiedSlots.length }, (_, i) => i + 1).map((slot) => (
        <div
            key={slot}
            className={`slot ${occupiedSlots.includes(slot) ? 'occupied' : 'available'}`}
            onClick={() =>
                !occupiedSlots.includes(slot) && setNewService({ ...newService, slotNumber: slot })
            }
        >
            {slot}
        </div>
    ))}
</div>


                    <label htmlFor="cameraUrl">Camera URL:</label>
                    <input
                        id="cameraUrl"
                        name="cameraUrl"
                        value={newService.cameraUrl}
                        className="form-input"
                        disabled
                    />
    {errors.floor && <p className="error-message">{errors.floor}</p>}

    <label htmlFor="durationMonths">Thời gian (tháng):</label>
    <input
        id="durationMonths"
        name="durationMonths"
        type="number"
        value={newService.durationMonths}
        onChange={handleInputChange}
        className="form-input"
    />
    {errors.durationMonths && <p className="error-message">{errors.durationMonths}</p>}

    <label htmlFor="description">Mô tả:</label>
    <textarea
        id="description"
        name="description"
        value={newService.description}
        onChange={handleInputChange}
        className="form-textarea"
    />
    {errors.description && <p className="error-message">{errors.description}</p>}

    <button onClick={handleAddService} className="form-button">
        Thêm dịch vụ
    </button>
</div>

            <h3>Các dịch vụ hiện có</h3>
            <ul className="service-list">
    {services.map((service) => {
        const isRegistered = !!serviceRegistrations[service.id];
        return (
            <li
                key={service.id}
                className={`service-item ${isRegistered ? 'registered-service' : ''}`}
            >
                <h4>{`${service.name} - ${service.applicableType}`}</h4>
                <p>Giá: {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p>Thời gian: {service.durationMonths} tháng</p>
                <p>Khu: {service.zone}</p>
                <p>Tầng: {service.floor}</p>
                <p>Vị trí: {service.slotNumber}</p>
                <p>Camera: {service.cameraUrl}</p>
                <p>Mô tả: {service.description}</p>
                
                {isRegistered ? (
                    <h2 className="service-status registered">Đã có Người đăng ký</h2>
                ) : (
                    <h2 className="service-status unregistered">Chưa có người đăng ký</h2>
                )}

                {/* Hiển thị thông tin đăng ký nếu có */}
                {isRegistered &&
                    serviceRegistrations[service.id]?.map((registration, index) => (
                        <div key={index} className="registration-info">
                            <p>Người đăng ký: {registration.userName}</p>
                            <p>Biển số xe: {registration.licensePlate}</p>
                            <p>Gmail: {registration.gmail}</p>
                        </div>
                    ))}
            </li>
        );
    })}
</ul>


<h3>Dịch Vụ Người Dùng Thanh Toán Không Đúng Hạn</h3>
    {overdueServices.length > 0 ? (
        <ul>
            {overdueServices.map((service, index) => (
                <li key={index}>
                    <h4>{service.name}</h4>
                    <p>Hạn thanh toán: {new Date(service.paymentDueDate).toLocaleDateString('vi-VN')}</p>
                    <p>Trạng thái: {service.paymentStatus}</p>
                </li>
            ))}
        </ul>
    ) : (
        <p>Không có dịch vụ nào người dùng thanh toán không đúng hạn.</p>
    )}

    <h3>Dịch Vụ Hết Thời Hạn Sử Dụng</h3>
    {expiredServices.length > 0 ? (
        <ul>
            {expiredServices.map((service, index) => (
                <li key={index}>
                    <h4>{service.name}</h4>
                    <p>Thời gian kết thúc: {new Date(service.endDate).toLocaleDateString('vi-VN')}</p>
                </li>
            ))}
        </ul>
    ) : (
        <p>Không có dịch vụ nào hết thời hạn sử dụng.</p>
    )}
        </div>
    );
}

export default ParkingServiceAdmin;
