import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/Invoice.css';

const Invoice = () => {
  const [invoices, setInvoices] = useState({
    userInvoices: {},
    userTotals: {},
    totalSystemAmount: 0,
    monthlyRevenue: {},
  });

  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/admin/invoices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Tính doanh thu theo tháng
        const monthlyRevenue = {};
        Object.entries(response.data.userInvoices).forEach(([email, services]) => {
          services.forEach(service => {
            if (service.paymentStatus === "Đã thanh toán" && service.paymentDate) {
              const serviceMonth = getMonthFromPaymentDate(service.paymentDate);
              if (serviceMonth) {
                monthlyRevenue[serviceMonth] = (monthlyRevenue[serviceMonth] || 0) + service.price;
              }
            }
          });
        });

        const userTotals = {};
        Object.entries(response.data.userInvoices).forEach(([email, services]) => {
          userTotals[email] = services
            .filter(service => service.paymentStatus === "Đã thanh toán")
            .reduce((total, service) => total + service.price, 0);
        });

        const totalSystemAmount = Object.values(userTotals).reduce(
          (total, userTotal) => total + userTotal,
          0
        );

        setInvoices({
          ...response.data,
          userTotals,
          totalSystemAmount,
          monthlyRevenue,
        });
      } catch (error) {
        console.error("Lỗi khi tải hóa đơn:", error);
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getMonthFromPaymentDate = (paymentDate) => {
    const date = new Date(paymentDate);
    if (isNaN(date)) return null;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  const exportReport = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa Đơn</title>
          <link rel="stylesheet" type="text/css" href="invoice.css">
        </head>
        <body>
          <h2 style="text-align: center;">Thống Kê Hóa Đơn</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportMonthlyReport = () => {
    if (!selectedMonth) {
      alert("Vui lòng chọn tháng để xuất báo cáo.");
      return;
    }

    const printContent = document.getElementById(`month-${selectedMonth}`).innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Báo Cáo Tháng ${selectedMonth}</title>
          <link rel="stylesheet" type="text/css" href="invoice.css">
        </head>
        <body>
          <h2 style="text-align: center;">Báo Cáo Tháng ${selectedMonth}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  const getInvoicesByMonthTotal = (month) => {
    const invoicesByMonth = getInvoicesByMonth(month);
    let total = 0;
    Object.values(invoicesByMonth).forEach((services) => {
      total += services.reduce((sum, service) => sum + service.price, 0);
    });
    return total;
  };
  
  const getInvoicesByMonth = (month) => {
    const filteredInvoices = {};
    Object.entries(invoices.userInvoices).forEach(([email, services]) => {
      const filteredServices = services.filter(service => {
        if (service.paymentStatus === "Đã thanh toán" && service.paymentDate) {
          const serviceMonth = getMonthFromPaymentDate(service.paymentDate);
          return serviceMonth === month;
        }
        return false;
      });
      if (filteredServices.length > 0) {
        filteredInvoices[email] = filteredServices;
      }
    });
    return filteredInvoices;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thống Kê Hóa Đơn</h2>
      <h3>Thống Kê Doanh Thu Theo Tháng</h3>
      <table>
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Doanh Thu</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(invoices.monthlyRevenue).map(([month, revenue]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{revenue} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <label>
        Chọn Tháng:
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Chọn tháng --</option>
          {Object.keys(invoices.monthlyRevenue).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>
      <button onClick={exportMonthlyReport}>
        Xuất Báo Cáo Theo Tháng
      </button>

      <button onClick={exportReport}>
        Xuất Báo Cáo Toàn Bộ
      </button>

      {/* Nội dung cho báo cáo theo tháng */}
      <div id={`month-${selectedMonth}`} style={{ display: 'none' }}>
        {Object.entries(getInvoicesByMonth(selectedMonth)).map(([email, services]) => (
          <div key={email}>
            <h3>Email: {email}</h3>
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Giá</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Ngày Thanh Toán</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceName}</td>
                    <td>{service.price} VNĐ</td>
                    <td>{formatDate(service.startDate)}</td>
                    <td>{formatDate(service.endDate)}</td>
                    <td>{service.paymentStatus}</td>
                    <td>{formatDate(service.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
         <h4>
    Tổng doanh thu tháng {selectedMonth}: {getInvoicesByMonthTotal(selectedMonth).toLocaleString()} VNĐ
  </h4>
      </div>

      {/* Nội dung chính */}
      <div id="print-area">
        {Object.entries(invoices.userInvoices).map(([email, services]) => (
          <div key={email}>
            <h3>Email: {email}</h3>
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Giá</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Ngày Thanh Toán</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceName}</td>
                    <td>{service.price} VNĐ</td>
                    <td>{formatDate(service.startDate)}</td>
                    <td>{formatDate(service.endDate)}</td>
                    <td>{service.paymentStatus}</td>
                    <td>{formatDate(service.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>
              Tổng tiền đã thanh toán: {invoices.userTotals[email]} VNĐ
            </h4>
          </div>
        ))}
        <h3>
          Tổng doanh thu hệ thống: {invoices.totalSystemAmount} VNĐ
        </h3>
      </div>
    </div>
  );
};

export default Invoice;
