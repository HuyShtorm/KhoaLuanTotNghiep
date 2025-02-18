import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../../css/ParkingServiceUser.css'; // Import CSS file

function ParkingServiceUser() {
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [expiredServices, setExpiredServices] = useState([]);
    const [subscribedServices, setSubscribedServices] = useState([]);
    const [overduePaymentServices, setOverduePaymentServices] = useState([]);
    const [subscriptionDetails, setSubscriptionDetails] = useState({
        startDate: '',
        endDate: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch data
    const fetchAndProcessData = async () => {
        const token = localStorage.getItem('token');
        try {
            const servicesResponse = await axios.get('/api/users/parking-services', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const vehiclesResponse = await axios.get('/api/users/approved-vehicles', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const servicesData = servicesResponse.data.map(service => ({
                ...service,
                isLocked: service.isLocked,
            }));

            setServices(servicesData);
            setVehicles(vehiclesResponse.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải dữ liệu. Vui lòng thử lại sau!',
                confirmButtonText: 'Đồng ý',
            });
        }
    };

    const fetchUserServices = async () => {
        const token = localStorage.getItem('token');
        try {
            const expiredResponse = await axios.get('/api/users/expired-services', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExpiredServices(expiredResponse.data);

            const overduePaymentResponse = await axios.get('/api/users/overdue-payment-services', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOverduePaymentServices(overduePaymentResponse.data);

            const registeredResponse = await axios.get('/api/users/registered-services', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubscribedServices(registeredResponse.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau!',
                confirmButtonText: 'Đồng ý',
            });
        }
    };

    useEffect(() => {
        fetchAndProcessData();
        fetchUserServices();
    }, []);

    const handleSelectService = (serviceId, applicableType, durationMonths) => {
        const selected = services.find(service => service.id === serviceId);

        if (selected.isLocked) {
            Swal.fire({
                icon: 'warning',
                title: 'Dịch vụ đã khóa',
                text: 'Dịch vụ này đã được đăng ký bởi xe khác.',
                confirmButtonText: 'Đồng ý',
            });
            return;
        }

        setSelectedService(serviceId);
        setFilteredVehicles(
            vehicles.filter(vehicle => vehicle.type.toUpperCase() === applicableType.toUpperCase())
        );

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);

        setSubscriptionDetails({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        });
    };

    const handleSubscribe = async () => {
        if (!selectedVehicle) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn xe',
                text: 'Vui lòng chọn xe trước khi đăng ký dịch vụ.',
                confirmButtonText: 'Đồng ý',
            });
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `/api/users/subscribe-service/${selectedService}?vehicleId=${selectedVehicle}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Đăng ký thành công',
                text: 'Vui lòng truy cập hóa đơn để thanh toán.',
                confirmButtonText: 'Đồng ý',
            });

            fetchAndProcessData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: error.response?.data || 'Đăng ký dịch vụ thất bại.',
                confirmButtonText: 'Đồng ý',
            });
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="parking-service-container">
            <h2>Dịch Vụ Bãi Đỗ Xe Có Sẵn</h2>
            <input
                type="text"
                placeholder="Tìm Dịch Vụ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <div className="service-grid">
                {filteredServices.map(service => (
                    <div key={service.id} className="service-card">
                        <h4>{service.name}</h4>
                        <p>Chi Phí: {service.price} vnđ</p>
                        <p>Thời Hạn: {service.durationMonths} Tháng</p>
                        <p>Mô Tả : {service.description}</p>
                        <p>
                            Áp Dụng Cho:{' '}
                            {service.applicableType === 'MOTORBIKE'
                                ? 'Xe máy'
                                : service.applicableType === 'CAR'
                                ? 'Ô tô'
                                : 'Xe đạp'}
                        </p>
                        {service.isLocked ? (
                            <button className="locked-button" disabled>
                                Dịch Vụ Đã Khoá
                            </button>
                        ) : (
                            <button
                                className="select-button"
                                onClick={() =>
                                    handleSelectService(service.id, service.applicableType, service.durationMonths)
                                }
                            >
                                Chọn Dịch Vụ
                            </button>
                        )}
                        {selectedService === service.id && !service.isLocked && (
                            <div>
                                <h4>Chọn Xe của bạn</h4>
                                <select
                                    onChange={e => setSelectedVehicle(e.target.value)}
                                    className="vehicle-select"
                                >
                                    <option value="">-- Chọn Xe Đã Xác Nhận --</option>
                                    {filteredVehicles.map(vehicle => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.licensePlate} ({vehicle.type})
                                        </option>
                                    ))}
                                </select>
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
        </div>
    );
}

export default ParkingServiceUser;
