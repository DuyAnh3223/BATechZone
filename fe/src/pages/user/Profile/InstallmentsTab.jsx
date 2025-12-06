import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

import { useInstallmentStore } from '@/stores/useInstallmentStore';
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import InstallmentList from './components/InstallmentList';
import InstallmentDetailDialog from './components/InstallmentDetailDialog';
import PaymentDialog from './components/PaymentDialog';
import DownPaymentDialog from './components/DownPaymentDialog';

const InstallmentsTab = () => {
  const { user } = useUserAuthStore();
  const { 
    installments, 
    loading, 
    fetchMyInstallments,
    currentInstallment,
    fetchInstallmentById,
    makeDownPayment,
    makePayment
  } = useInstallmentStore();

  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDownPaymentDialogOpen, setIsDownPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer'); // bank_transfer, e_wallet, cod

  useEffect(() => {
    fetchMyInstallments();
  }, [fetchMyInstallments]);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'N/A';
    }
  };

 

  const handleViewDetail = async (installment) => {
    try {
      setIsDetailOpen(true);
      setSelectedInstallment({ ...installment, loading: true });
      
      // Store now returns extracted data directly
      const installmentData = await fetchInstallmentById(installment.installment_id);
      console.log('Component - Received installmentData:', installmentData);
      console.log('Component - Has payments:', installmentData?.payments?.length);
      
      setSelectedInstallment(installmentData);
    } catch (error) {
      console.error('Error fetching installment detail:', error);
      toast.error('Không thể tải chi tiết hợp đồng');
      setIsDetailOpen(false);
    }
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleDownPaymentClick = () => {
    setIsDownPaymentDialogOpen(true);
  };

  const handleConfirmDownPayment = async () => {
    if (!selectedInstallment) return;

    setIsProcessing(true);
    try {
      // Nếu chọn Momo (e_wallet), tạo payment link
      if (paymentMethod === 'e_wallet') {
        const amount = selectedInstallment.down_payment;
        const description = `Thanh toán trả trước hợp đồng #${selectedInstallment.installment_id}`;
        const buyerName = user?.full_name || user?.fullName || user?.username || 'Khách hàng';
        const buyerEmail = user?.email || `user_${Date.now()}@batechzone.com`;
        const buyerPhone = user?.phone || '0000000000';
        const buyerAddress = 'BATechZone';
        
        // Lưu thông tin installment vào localStorage để xử lý sau khi thanh toán
        localStorage.setItem('pending_installment_payment', JSON.stringify({
          installmentId: selectedInstallment.installment_id,
          type: 'down_payment',
          amount: amount
        }));

        try {
          const paymentResponse = await fetch('http://localhost:5001/api/payments/create-payment-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              amount,
              description,
              buyerName,
              buyerEmail,
              buyerPhone,
              buyerAddress,
              paymentType: 'wallet'
            })
          });

          const result = await paymentResponse.json();

          if (result.success && result.data?.checkoutUrl) {
            toast.success('Đang chuyển đến trang thanh toán Momo...');
            // Chuyển hướng đến trang thanh toán Momo
            window.location.href = result.data.checkoutUrl;
            return;
          } else {
            throw new Error(result.message || 'Không thể tạo link thanh toán Momo');
          }
        } catch (error) {
          console.error('Momo payment error:', error);
          toast.error(error.message || 'Không thể tạo link thanh toán Momo');
          setIsProcessing(false);
          return;
        }
      }

      // Thanh toán bằng phương thức khác (bank_transfer, cod)
      const paymentNote = `Thanh toán trả trước qua ${paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : paymentMethod === 'e_wallet' ? 'Ví điện tử' : 'Tiền mặt'}`;
      
      await makeDownPayment(selectedInstallment.installment_id, {
        paid_date: new Date().toISOString(),
        note: paymentNote
      });
      
      toast.success('Thanh toán trả trước thành công! Vui lòng chờ xác nhận từ hệ thống.');
      setIsDownPaymentDialogOpen(false);
      setPaymentMethod('bank_transfer');
      
      // Refresh detail
      const updated = await fetchInstallmentById(selectedInstallment.installment_id);
      setSelectedInstallment(updated);
      
      // Refresh list
      fetchMyInstallments();
    } catch (error) {
      console.error('Error making down payment:', error);
      toast.error(error.response?.data?.message || 'Thanh toán trả trước thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      // Nếu chọn Momo (e_wallet), tạo payment link
      if (paymentMethod === 'e_wallet') {
        const amount = selectedPayment.payment_amount || selectedPayment.amount;
        
        // Validate amount
        if (!amount || parseFloat(amount) <= 0) {
          toast.error('Số tiền thanh toán không hợp lệ');
          setIsProcessing(false);
          return;
        }
        
        const description = `Thanh toán kỳ ${selectedPayment.payment_no} - Hợp đồng #${selectedInstallment.installment_id}`;
        const buyerName = user?.full_name || user?.fullName || user?.username || 'Khách hàng';
        const buyerEmail = user?.email || `user_${Date.now()}@batechzone.com`;
        const buyerPhone = user?.phone || '0000000000';
        const buyerAddress = 'BATechZone';
        
        // Lưu thông tin installment payment vào localStorage
        localStorage.setItem('pending_installment_payment', JSON.stringify({
          installmentId: selectedInstallment.installment_id,
          paymentId: selectedPayment.payment_id,
          type: 'installment',
          amount: amount
        }));

        try {
          const paymentResponse = await fetch('http://localhost:5001/api/payments/create-payment-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              amount,
              description,
              buyerName,
              buyerEmail,
              buyerPhone,
              buyerAddress,
              paymentType: 'wallet'
            })
          });

          const result = await paymentResponse.json();

          if (result.success && result.data?.checkoutUrl) {
            toast.success('Đang chuyển đến trang thanh toán Momo...');
            window.location.href = result.data.checkoutUrl;
            return;
          } else {
            throw new Error(result.message || 'Không thể tạo link thanh toán Momo');
          }
        } catch (error) {
          console.error('Momo payment error:', error);
          toast.error(error.message || 'Không thể tạo link thanh toán Momo');
          setIsProcessing(false);
          return;
        }
      }

      // Thanh toán bằng phương thức khác (bank_transfer, cod)
      const paymentNote = `Thanh toán qua ${paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : paymentMethod === 'e_wallet' ? 'Ví điện tử' : 'Tiền mặt'}`;
      
      await makePayment(selectedPayment.payment_id, {
        paid_date: new Date().toISOString(),
        note: paymentNote
      });
      
      toast.success('Thanh toán thành công! Vui lòng chờ xác nhận từ hệ thống.');
      setIsPaymentDialogOpen(false);
      setPaymentMethod('bank_transfer'); // Reset to default
      
      // Refresh detail
      if (selectedInstallment) {
        const updated = await fetchInstallmentById(selectedInstallment.installment_id);
        setSelectedInstallment(updated.data || updated);
      }
      
      // Refresh list
      fetchMyInstallments();
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error(error.response?.data?.message || 'Thanh toán thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateOutstandingBalance = (installment) => {
    if (!installment) return 0;
    
    // Use outstanding_principal if available (backend calculated)
    if (installment.outstanding_principal !== undefined) {
      return parseFloat(installment.outstanding_principal);
    }
    
    // Fallback: calculate from total_amount - total_paid
    const total = parseFloat(installment.total_amount || 0);
    const paid = parseFloat(installment.total_paid || 0);
    return Math.max(0, total - paid);
  };

  
  const canPayDownPayment = (installment) => {
    if (!installment) return false;
    // Chỉ cho phép thanh toán trả trước khi status = 'approved'
    return installment.status === 'approved' && 
           installment.down_payment_status !== 'paid' &&
           installment.down_payment > 0;
  };

  
  const canPayInstallments = (installment) => {
    if (!installment) return false;
    // Chỉ cho phép thanh toán các kỳ khi status = 'active'
    return installment.status === 'active';
  };

  
  const getStatusExplanation = (installment) => {
    if (!installment) return '';
    
    if (installment.status === 'pending') {
      return 'Hợp đồng đang chờ admin duyệt. Bạn chưa thể thanh toán.';
    } else if (installment.status === 'approved') {
      return 'Hợp đồng đã được duyệt. Vui lòng thanh toán trả trước để kích hoạt hợp đồng.';
    } else if (installment.status === 'rejected') {
      return 'Hợp đồng đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.';
    } else if (installment.status === 'cancelled') {
      return 'Hợp đồng đã bị hủy.';
    } else if (installment.status === 'active') {
      return 'Hợp đồng đang hoạt động. Bạn có thể thanh toán các kỳ hàng tháng.';
    } else if (installment.status === 'completed') {
      return 'Hợp đồng đã hoàn thành.';
    }
    return '';
  };

  return (
    <>
      <InstallmentList
        installments={installments}
        loading={loading}
        onViewDetail={handleViewDetail}
        formatPrice={formatPrice}
        formatDate={formatDate}
        calculateOutstandingBalance={calculateOutstandingBalance}
      />

      <InstallmentDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        installment={selectedInstallment}
        formatPrice={formatPrice}
        formatDate={formatDate}
        calculateOutstandingBalance={calculateOutstandingBalance}
        canPayDownPayment={canPayDownPayment}
        canPayInstallments={canPayInstallments}
        getStatusExplanation={getStatusExplanation}
        onDownPaymentClick={handleDownPaymentClick}
        onPaymentClick={handlePaymentClick}
      />

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        payment={selectedPayment}
        installment={selectedInstallment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onConfirm={handleConfirmPayment}
        isProcessing={isProcessing}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />

      <DownPaymentDialog
        isOpen={isDownPaymentDialogOpen}
        onClose={() => setIsDownPaymentDialogOpen(false)}
        installment={selectedInstallment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onConfirm={handleConfirmDownPayment}
        isProcessing={isProcessing}
        formatPrice={formatPrice}
      />
    </>
  );
};

export default InstallmentsTab;
