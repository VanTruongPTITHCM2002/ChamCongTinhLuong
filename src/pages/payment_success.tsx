import { useRouter } from 'next/router';
import React from 'react';


const PaymentSuccess: React.FC = async () => {
  const router = useRouter();


  const handleBackToPayroll = () => {
    
    router.push('/admin/payroll');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
    <h1>✅</h1> {/* Dấu tích xanh */}
    <h1>Thanh toán thành công!</h1>
    <p>Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý.</p>
    <button onClick={handleBackToPayroll}>Quay lại trang quản lý tính lương</button>
  </div>
  );
};

export default PaymentSuccess;