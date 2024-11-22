// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function ParkingServiceAdmin() {
//     const [services, setServices] = useState([]);
//     const [newService, setNewService] = useState({
//         name: '',
//         price: 0,
//         applicableType: 'MOTORBIKE',
//         durationMonths: 1, // Thời gian mặc định là 1 tháng
//         description: ''
//     });

//     useEffect(() => {
//         const fetchServices = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get('/api/admin/parking-services', { // Đảm bảo endpoint khớp với backend
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setServices(response.data);
//             } catch (error) {
//                 console.error('Error fetching services:', error);
//                 alert('Failed to load services.');
//             }
//         };
//         fetchServices();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewService({ ...newService, [name]: value });
//     };

//     const handleAddService = async () => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.post('/api/admin/add-parking-service', newService, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setServices([...services, response.data]);
//             alert('Service added successfully');
//             setNewService({
//                 name: '',
//                 price: 0,
//                 applicableType: 'MOTORBIKE',
//                 durationMonths: 1,
//                 description: ''
//             });
//         } catch (error) {
//             console.error('Error adding service:', error);
//             alert('Failed to add service. Please try again.');
//         }
//     };

//     return (
//         <div>
//             <h2>Manage Parking Services</h2>
//             <div>
//                 <h3>Add New Service</h3>
//                 <input name="name" placeholder="Name" value={newService.name} onChange={handleInputChange} />
//                 <input name="price" type="number" placeholder="Price" value={newService.price} onChange={handleInputChange} />
//                 <select name="applicableType" value={newService.applicableType} onChange={handleInputChange}>
//                     <option value="MOTORBIKE">Motorbike</option>
//                     <option value="BICYCLE">Bicycle</option>
//                     <option value="CAR">Car</option>
//                 </select>
//                 <input
//                     name="durationMonths"
//                     type="number"
//                     placeholder="Duration (Months)"
//                     value={newService.durationMonths}
//                     onChange={handleInputChange}
//                 />
//                 <textarea name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} />
//                 <button onClick={handleAddService}>Add Service</button>
//             </div>

//             <h3>Existing Services</h3>
//             <ul>
//                 {services.map(service => (
//                     <li key={service.id}>
//                         <h4>{service.name} - {service.applicableType}</h4>
//                         <p>Price: ${service.price}</p>
//                         <p>Duration: {service.durationMonths} months</p>
//                         <p>Description: {service.description}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default ParkingServiceAdmin;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../css/ParkingServiceAdmin.css';

// function ParkingServiceAdmin() {

//     const [services, setServices] = useState([]);
//     const [newService, setNewService] = useState({
//         name: '',
//         price: 0,
//         applicableType: 'MOTORBIKE',
//         durationMonths: 1,
//         description: ''
//     });


//     useEffect(() => {
//         const fetchServices = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get('/api/admin/parking-services', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setServices(response.data);
//             } catch (error) {
//                 console.error('Lỗi khi tải dịch vụ:', error);
//                 alert('Không thể tải danh sách dịch vụ.');
//             }
//         };
//         fetchServices();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewService({ ...newService, [name]: value });
//     };

//     const handleAddService = async () => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.post('/api/admin/add-parking-service', newService, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setServices([...services, response.data]);
//             alert('Thêm dịch vụ thành công');
//             setNewService({
//                 name: '',
//                 price: 0,
//                 applicableType: 'MOTORBIKE',
//                 durationMonths: 1,
//                 description: ''
//             });
//         } catch (error) {
//             console.error('Lỗi khi thêm dịch vụ:', error);
//             alert('Thêm dịch vụ thất bại. Vui lòng thử lại.');
//         }
//     };

//     return (
//         <div className="parking-service-admin">
//             <h2>Quản lý Dịch vụ Bãi đỗ xe</h2>
//             <h3>Thêm dịch vụ mới</h3>
//             <div className="form-container">
           
//                 <div className="form-group">
//                     <label htmlFor="name">Tên dịch vụ:</label>
//                     <input
//                         id="name"
//                         name="name"
//                         value={newService.name}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />
                
//                     <label htmlFor="price">Giá tiền:</label>
//                     <input
//                         id="price"
//                         name="price"
//                         type="number"
//                         value={newService.price}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />
              
//                     <label htmlFor="applicableType">Áp dụng cho:</label>
//                     <select
//                         id="applicableType"
//                         name="applicableType"
//                         value={newService.applicableType}
//                         onChange={handleInputChange}
//                         className="form-select"
//                     >
//                         <option value="MOTORBIKE">Xe máy</option>
//                         <option value="BICYCLE">Xe đạp</option>
//                         <option value="CAR">Ô tô</option>
//                     </select>
               
//                     <label htmlFor="durationMonths">Thời gian (tháng):</label>
//                     <input
//                         id="durationMonths"
//                         name="durationMonths"
//                         type="number"
//                         value={newService.durationMonths}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />
                
//                     <label htmlFor="description">Mô tả:</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={newService.description}
//                         onChange={handleInputChange}
//                         className="form-textarea"
//                     />
//                 </div>
                
//             </div>
//             <button onClick={handleAddService} className="form-button">Thêm dịch vụ</button>
//             <h3>Các dịch vụ hiện có</h3>
//             <ul className="service-list">
//                 {services.map(service => (
//                     <li key={service.id} className="service-item">
//                         <h4>{service.name} - {service.applicableType}</h4>
//                         <p>Giá: {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
//                         <p>Thời gian: {service.durationMonths} tháng</p>
//                         <p>Mô tả: {service.description}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default ParkingServiceAdmin;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../css/ParkingServiceAdmin.css';

// function ParkingServiceAdmin() {
//     const [services, setServices] = useState([]);
//     const [newService, setNewService] = useState({
//         name: '',
//         price: 0,
//         applicableType: 'CAR',
//         zone: '',
//         floor: '',
//         slotNumber: '',
//         cameraUrl: '',
//         durationMonths: 1,
//         description: '',
//     });

//     const [zones, setZones] = useState({
//         CAR: ['Khu A'],
//         MOTORBIKE: ['Khu B'],
//         BICYCLE: ['Khu C'],
//     });

//     const [floors, setFloors] = useState({
//         'Khu A': ['Tầng 1', 'Tầng 2', 'Hầm B1'],
//         'Khu B': ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Hầm B1'],
//         'Khu C': ['Tầng trệt'],
//     });

//     const [slots, setSlots] = useState([]);
//     const [occupiedSlots, setOccupiedSlots] = useState([]);

//     const [cameras, setCameras] = useState({
//         'Tầng 1': 'http://192.168.1.191:8080/video',
//         'Tầng 2': 'http://192.168.1.192:8080/video',
//         'Hầm B1': 'http://192.168.1.193:8080/video',
//         'Tầng 3': 'http://192.168.1.194:8080/video',
//         'Tầng trệt': 'http://192.168.1.195:8080/video',
//     });

//     useEffect(() => {
//         const fetchServices = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get('/api/admin/parking-services', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setServices(response.data);
//             } catch (error) {
//                 console.error('Lỗi khi tải dịch vụ:', error);
//                 alert('Không thể tải danh sách dịch vụ.');
//             }
//         };
//         fetchServices();
//     }, []);

//     useEffect(() => {
//         if (newService.zone && newService.floor) {
//             const fetchAvailableSlots = async () => {
//                 try {
//                     const response = await axios.get(`/api/admin/available-slots`, {
//                         params: {
//                             zone: newService.zone,
//                             floor: newService.floor,
//                             totalSlots: 50, // Giả định tối đa 50 vị trí mỗi tầng
//                         },
//                     });
//                     setSlots(response.data);
//                     const allSlots = Array.from({ length: 50 }, (_, i) => i + 1); // Tất cả các vị trí
//                     setOccupiedSlots(allSlots.filter(slot => !response.data.includes(slot))); // Lọc các vị trí đã chiếm
//                 } catch (error) {
//                     console.error('Lỗi khi tải vị trí khả dụng:', error);
//                 }
//             };
//             fetchAvailableSlots();
//         }
//     }, [newService.zone, newService.floor]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'applicableType') {
//             setNewService({
//                 ...newService,
//                 [name]: value,
//                 zone: '',
//                 floor: '',
//                 slotNumber: '',
//                 cameraUrl: '',
//             });
//         } else if (name === 'zone') {
//             setNewService({
//                 ...newService,
//                 [name]: value,
//                 floor: '',
//                 slotNumber: '',
//                 cameraUrl: '',
//             });
//         } else if (name === 'floor') {
//             setNewService({
//                 ...newService,
//                 [name]: value,
//                 slotNumber: '',
//                 cameraUrl: cameras[value],
//             });
//         } else {
//             setNewService({ ...newService, [name]: value });
//         }
//     };

//     const handleAddService = async () => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.post('/api/admin/add-parking-service', newService, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setServices([...services, response.data]);
//             alert('Thêm dịch vụ thành công');
//             setNewService({
//                 name: '',
//                 price: 0,
//                 applicableType: 'CAR',
//                 zone: '',
//                 floor: '',
//                 slotNumber: '',
//                 cameraUrl: '',
//                 durationMonths: 1,
//                 description: '',
//             });
//         } catch (error) {
//             console.error('Lỗi khi thêm dịch vụ:', error);
//             alert('Thêm dịch vụ thất bại. Vui lòng thử lại.');
//         }
//     };

//     return (
//         <div className="parking-service-admin">
//             <h2>Quản lý Dịch vụ Bãi đỗ xe</h2>
//             <h3>Thêm dịch vụ mới</h3>
//             <div className="form-container">
//                 <div className="form-group">
//                     <label htmlFor="name">Tên dịch vụ:</label>
//                     <input
//                         id="name"
//                         name="name"
//                         value={newService.name}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />

//                     <label htmlFor="price">Giá tiền:</label>
//                     <input
//                         id="price"
//                         name="price"
//                         type="number"
//                         value={newService.price}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />

//                     <label htmlFor="applicableType">Áp dụng cho:</label>
//                     <select
//                         id="applicableType"
//                         name="applicableType"
//                         value={newService.applicableType}
//                         onChange={handleInputChange}
//                         className="form-select"
//                     >
//                         <option value="CAR">Ô tô</option>
//                         <option value="MOTORBIKE">Xe máy</option>
//                         <option value="BICYCLE">Xe đạp</option>
//                     </select>

//                     <label htmlFor="zone">Khu:</label>
//                     <select
//                         id="zone"
//                         name="zone"
//                         value={newService.zone}
//                         onChange={handleInputChange}
//                         className="form-select"
//                     >
//                         <option value="">-- Chọn Khu --</option>
//                         {zones[newService.applicableType]?.map((zone) => (
//                             <option key={zone} value={zone}>
//                                 {zone}
//                             </option>
//                         ))}
//                     </select>

//                     <label htmlFor="floor">Tầng:</label>
//                     <select
//                         id="floor"
//                         name="floor"
//                         value={newService.floor}
//                         onChange={handleInputChange}
//                         className="form-select"
//                     >
//                         <option value="">-- Chọn Tầng --</option>
//                         {floors[newService.zone]?.map((floor) => (
//                             <option key={floor} value={floor}>
//                                 {floor}
//                             </option>
//                         ))}
//                     </select>

//                     <label htmlFor="slots">Vị trí:</label>
//                     <div className="slots-container">
//                         {Array.from({ length: 50 }, (_, i) => i + 1).map((slot) => (
//                             <div
//                                 key={slot}
//                                 className={`slot ${
//                                     occupiedSlots.includes(slot) ? 'occupied' : 'available'
//                                 }`}
//                                 onClick={() =>
//                                     !occupiedSlots.includes(slot) && setNewService({ ...newService, slotNumber: slot })
//                                 }
//                             >
//                                 {slot}
//                             </div>
//                         ))}
//                     </div>

//                     <label htmlFor="cameraUrl">Camera URL:</label>
//                     <input
//                         id="cameraUrl"
//                         name="cameraUrl"
//                         value={newService.cameraUrl}
//                         onChange={handleInputChange}
//                         className="form-input"
//                         disabled
//                     />

//                     <label htmlFor="durationMonths">Thời gian (tháng):</label>
//                     <input
//                         id="durationMonths"
//                         name="durationMonths"
//                         type="number"
//                         value={newService.durationMonths}
//                         onChange={handleInputChange}
//                         className="form-input"
//                     />

//                     <label htmlFor="description">Mô tả:</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={newService.description}
//                         onChange={handleInputChange}
//                         className="form-textarea"
//                     />
//                 </div>
//             </div>
//             <button onClick={handleAddService} className="form-button">
//                 Thêm dịch vụ
//             </button>
//             <h3>Các dịch vụ hiện có</h3>
//             <ul className="service-list">
//                 {services.map((service) => (
//                     <li key={service.id} className="service-item">
//                         <h4>{`${service.name} - ${service.applicableType}`}</h4>
//                         <p>Giá: {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
//                         <p>Thời gian: {service.durationMonths} tháng</p>
//                         <p>Khu: {service.zone}</p>
//                         <p>Tầng: {service.floor}</p>
//                         <p>Vị trí: {service.slotNumber}</p>
//                         <p>Camera: {service.cameraUrl}</p>
//                         <p>Mô tả: {service.description}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default ParkingServiceAdmin;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/ParkingServiceAdmin.css';

function ParkingServiceAdmin() {
    const [services, setServices] = useState([]);
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
                'Tầng 1': { totalSlots: 20, cameraUrl: 'http://192.168.1.191:8080/video' },
                'Tầng 2': { totalSlots: 15, cameraUrl: 'http://192.168.1.192:8080/video' },
                'Hầm B1': { totalSlots: 25, cameraUrl: 'http://192.168.1.193:8080/video' },
            },
        },
        'Khu B': {
            type: 'MOTORBIKE',
            floors: {
                'Tầng 1': { totalSlots: 30, cameraUrl: 'http://192.168.1.2:8080/video' },
                'Tầng 2': { totalSlots: 25, cameraUrl: 'http://192.168.2.192:8080/video' },
                'Tầng 3': { totalSlots: 20, cameraUrl: 'http://192.168.2.193:8080/video' },
                'Hầm B1': { totalSlots: 35, cameraUrl: 'http://192.168.2.194:8080/video' },
            },
        },
        'Khu C': {
            type: 'BICYCLE',
            floors: {
                'Tầng Trệt': { totalSlots: 50, cameraUrl: 'http://192.168.3.191:8080/video' },
            },
        },
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
        fetchServices();
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
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/admin/add-parking-service', newService, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices([...services, response.data]);
            alert('Thêm dịch vụ thành công');
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
        } catch (error) {
            console.error('Lỗi khi thêm dịch vụ:', error);
            alert('Thêm dịch vụ thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="parking-service-admin">
            <h2>Quản lý Dịch vụ Bãi đỗ xe</h2>
            <h3>Thêm dịch vụ mới</h3>
            <div className="form-container">
                <div className="form-group">
                    <label htmlFor="name">Tên dịch vụ:</label>
                    <input
                        id="name"
                        name="name"
                        value={newService.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    <label htmlFor="price">Giá tiền:</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        value={newService.price}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    <label htmlFor="applicableType">Áp dụng cho:</label>
                    <select
                        id="applicableType"
                        name="applicableType"
                        value={newService.applicableType}
                        onChange={handleInputChange}
                        className="form-select"
                    >
                        <option value="CAR">Ô tô</option>
                        <option value="MOTORBIKE">Xe máy</option>
                        <option value="BICYCLE">Xe đạp</option>
                    </select>

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

                    <label htmlFor="durationMonths">Thời gian (tháng):</label>
                    <input
                        id="durationMonths"
                        name="durationMonths"
                        type="number"
                        value={newService.durationMonths}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newService.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                    />
                </div>
            </div>
            <button onClick={handleAddService} className="form-button">
                Thêm dịch vụ
            </button>
            <h3>Các dịch vụ hiện có</h3>
            <ul className="service-list">
                {services.map((service) => (
                    <li key={service.id} className="service-item">
                        <h4>{`${service.name} - ${service.applicableType}`}</h4>
                        <p>Giá: {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        <p>Thời gian: {service.durationMonths} tháng</p>
                        <p>Khu: {service.zone}</p>
                        <p>Tầng: {service.floor}</p>
                        <p>Vị trí: {service.slotNumber}</p>
                        <p>Camera: {service.cameraUrl}</p>
                        <p>Mô tả: {service.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ParkingServiceAdmin;
