import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import momoImage from "../../img/momo.webp";
import bankImage from "../../img/ag.webp";
import visaImage from "../../img/visa.webp";
import momoQR from "../../img/momoqr.png";
import bankQR from "../../img/bankqr.png";
import "../../css/MyInvoice.css";

const MyInvoice = () => {
  const [invoice, setInvoice] = useState({ services: [], totalAmount: 0 });
  const [selectedServices, setSelectedServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [modalData, setModalData] = useState({});

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(response.data);
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn:", error);
    }
  };
  
  // Gọi `fetchInvoice` khi component được mount
  useEffect(() => {
    fetchInvoice();
  }, []);
  

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  const handleSelectService = (serviceId, price) => {
    setSelectedServices((prevSelectedServices) => {
      const isSelected = prevSelectedServices.some(
        (service) => service.serviceId === serviceId
      );

      if (isSelected) {
        return prevSelectedServices.filter(
          (service) => service.serviceId !== serviceId
        );
      } else {
        return [
          ...prevSelectedServices,
          { serviceId, price: Number(price) || 0 },
        ];
      }
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + service.price;
    }, 0);
  };

  const handlePaymentClick = (method) => {
    setPaymentMethod(method);
    setModalData({
      qrImage: method === "Momo" ? momoQR : method === "Bank" ? bankQR : null,
      accountNumber:
        method === "Momo"
          ? ["0348456434 (Momo)", "Chủ tài khoản: NGUYEN QUOC HUY"]
          : method === "Bank"
          ? ["Số tài khoản: 6907205330584", "Chủ tài khoản: NGUYEN QUOC HUY"]
          : [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePaymentSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const serviceIds = selectedServices.map((service) => service.serviceId);
  
      if (serviceIds.length === 0) {
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng chọn ít nhất một dịch vụ để thanh toán.",
          icon: "warning",
          allowOutsideClick: false,
        });
        return;
      }
  
      const response = await axios.post(
        "/api/users/mock-payment",
        { serviceIds, paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Hiển thị thông báo SweetAlert2
      await Swal.fire({
        title: "Thanh toán thành công",
        text: response.data.message,
        icon: "success",
        showConfirmButton: true,
        allowOutsideClick: false, // Không tự tắt
      });
  
      // Tải lại danh sách hóa đơn mà không làm mới trang
      fetchInvoice();
  
      // Đóng modal
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        title: "Thanh toán thất bại",
        text: error.response?.data || "Có lỗi xảy ra, vui lòng thử lại.",
        icon: "error",
        showConfirmButton: true,
        allowOutsideClick: false,
      });
    }
  };
  
  

  const unpaidServices = invoice.services.filter(
    (service) => service.paymentStatus?.toLowerCase() === "chưa thanh toán"
  );

  const paidServices = invoice.services.filter(
    (service) => service.paymentStatus?.toLowerCase() === "đã thanh toán"
  );

  return (
    <div className="invoice-container">
      <h2 className="invoice-header">Hóa Đơn Của Tôi</h2>

      <h3 className="invoice-section-header">Dịch vụ chưa thanh toán</h3>
      <ul>
        {unpaidServices.length > 0 ? (
          unpaidServices.map((service, index) => (
            <li key={index} className="invoice-item">
              <input
                type="checkbox"
                onChange={() =>
                  handleSelectService(service.parkingServiceId, service.price)
                }
              />
              <span>
                <strong>Dịch vụ:</strong> {service.serviceName}
              </span>
              <p>
                <strong>Giá:</strong>{" "}
                {service.price ? Number(service.price).toLocaleString() : "0"}{" "}
                VNĐ
              </p>
              <p>
                <strong>Biển số xe:</strong> {service.licensePlate || "N/A"}
              </p>
              <p>
                <strong>Ngày bắt đầu:</strong> {formatDate(service.startDate)}
              </p>
              <p>
                <strong>Ngày kết thúc:</strong> {formatDate(service.endDate)}
              </p>
              <p>
                <strong>Ngày hết hạn thanh toán:</strong>{" "}
                {service.paymentDueDate
                  ? formatDate(service.paymentDueDate)
                  : "N/A"}
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong> {service.paymentStatus}
              </p>
            </li>
          ))
        ) : (
          <p>Không có dịch vụ nào chưa thanh toán.</p>
        )}
      </ul>

      <h3 className="invoice-total">
        Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
      </h3>
      <div className="payment-methods">
        <h4>Phương thức thanh toán:</h4>
        <img
          src={momoImage}
          alt="Momo"
          className="payment-logo"
          onClick={() => handlePaymentClick("Momo")}
        />
        <img
          src={bankImage}
          alt="Bank"
          className="payment-logo"
          onClick={() => handlePaymentClick("Bank")}
        />
        <img
          src={visaImage}
          alt="Visa"
          className="payment-logo"
          onClick={() => handlePaymentClick("Visa")}
        />
      </div>

      {showModal && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Thanh toán bằng {paymentMethod}</h3>
            {paymentMethod === "Visa" ? (
              <div>
               
                <div className="form-group">
                  <label htmlFor="cardNumber">Mã thẻ:</label>
                  <input type="text" id="cardNumber" placeholder="Nhập mã thẻ (16 số)" />
                </div>
                <div className="form-group">
                  <label htmlFor="expiryDate">Ngày hết hạn:</label>
                  <input type="month" id="expiryDate" />
                </div>
                <div className="form-group">
                  <label htmlFor="CardCVV">Mã : CVV</label>
                  <input type="text" id="cardCVV" placeholder="Nhập Mã CVV" />
                </div>
                <div className="form-group">
                  <label htmlFor="cardName">Họ tên trên thẻ:</label>
                  <input type="text" id="cardName" placeholder="Nhập họ tên trên thẻ" />
                </div>
              </div>
            ) : (
              <>
                {modalData.qrImage && <img src={modalData.qrImage} alt="QR Code" className="qr-code" />}
                {modalData.accountNumber &&
                  modalData.accountNumber.map((line, index) => <p key={index}>{line}</p>)}
              </>
            )}
            <button className="confirm-payment-btn" onClick={handlePaymentSubmit}>
              Thanh Toán {calculateTotal().toLocaleString()} VNĐ
            </button>
            <button onClick={closeModal} className="close-modal-btn">
              Đóng
            </button>
          </div>
        </div>
      )}

      <div className="paid-services-section">
        <h3 className="invoice-section-header">Dịch vụ đã thanh toán</h3>
        <ul>
          {paidServices.length > 0 ? (
            paidServices.map((service, index) => (
              <li key={index} className="invoice-item paid-service">
                <span>
                  <strong>Dịch vụ:</strong> {service.serviceName}
                </span>
                <p>
                  <strong>Giá:</strong>{" "}
                  {service.price ? Number(service.price).toLocaleString() : "0"}{" "}
                  VNĐ
                </p>
                <p>
                  <strong>Biển số xe:</strong> {service.licensePlate || "N/A"}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong> {formatDate(service.startDate)}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong> {formatDate(service.endDate)}
                </p>
                <p>
                  <strong>Ngày hết hạn thanh toán:</strong>{" "}
                  {service.paymentDueDate
                    ? formatDate(service.paymentDueDate)
                    : "N/A"}
                </p>
                <p>
                  <strong>Ngày thanh toán:</strong>{" "}
                  {service.paymentDate ? formatDate(service.paymentDate) : "N/A"}
                </p>
                <p>
                  <strong>Trạng thái thanh toán:</strong> {service.paymentStatus}
                </p>
              </li>
            ))
          ) : (
            <p>Không có dịch vụ nào đã thanh toán.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyInvoice;
