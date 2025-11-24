import React from 'react';

const PaymentMethodSelector = ({ 
  value, 
  onChange, 
  installmentId, 
  paymentNo = null,
  type = 'installment' // 'installment' or 'down_payment'
}) => {
  const paymentMethodLabels = {
    bank_transfer: 'Chuyển khoản',
    e_wallet: 'Ví điện tử',
    cod: 'Tiền mặt'
  };

  const getTransferContent = () => {
    if (type === 'down_payment') {
      return `TRA TRUOC ${installmentId}`;
    }
    return `TRA GOP ${paymentNo} - ${installmentId}`;
  };

  return (
    <div>
      <label className="text-sm font-medium mb-3 block">
        Phương thức thanh toán
      </label>
      
      {/* Method Selection */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => onChange('bank_transfer')}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            value === 'bank_transfer'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium mb-1">Chuyển khoản</div>
          <div className="text-xs text-gray-600">Ngân hàng</div>
        </button>
        <button
          onClick={() => onChange('e_wallet')}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            value === 'e_wallet'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium mb-1">Ví điện tử</div>
          <div className="text-xs text-gray-600">Momo, ZaloPay</div>
        </button>
        <button
          onClick={() => onChange('cod')}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            value === 'cod'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium mb-1">Tiền mặt</div>
          <div className="text-xs text-gray-600">Tại cửa hàng</div>
        </button>
      </div>

      {/* Bank Transfer Instructions */}
      {value === 'bank_transfer' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-medium text-blue-900 mb-2">Thông tin chuyển khoản:</p>
          <div className="space-y-1 text-blue-800">
            <p>• Ngân hàng: <strong>Vietcombank</strong></p>
            <p>• STK: <strong>1234567890</strong></p>
            <p>• Tên TK: <strong>CONG TY TNHH BATECH</strong></p>
            <p>• Nội dung: <strong>{getTransferContent()}</strong></p>
          </div>
        </div>
      )}

      {/* E-Wallet Instructions */}
      {value === 'e_wallet' && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
          <p className="font-medium text-purple-900 mb-2">Thanh toán qua ví điện tử:</p>
          <div className="space-y-1 text-purple-800">
            <p>• Momo: <strong>0123456789</strong></p>
            <p>• ZaloPay: <strong>0123456789</strong></p>
            <p>• Nội dung: <strong>{getTransferContent()}</strong></p>
          </div>
        </div>
      )}

      {/* COD Instructions */}
      {value === 'cod' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <p className="font-medium text-green-900 mb-2">Thanh toán tại cửa hàng:</p>
          <div className="space-y-1 text-green-800">
            <p>• Địa chỉ: <strong>123 Đường ABC, Quận 1, TP.HCM</strong></p>
            <p>• Giờ làm việc: <strong>8:00 - 18:00 (T2-T7)</strong></p>
            <p>• Mang theo: <strong>Mã HĐ #{installmentId}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
