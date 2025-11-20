import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, Phone, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useInstallmentStore } from '@/stores/useInstallmentStore';

const OverdueManagement = () => {
  const { overduePayments, loading, fetchAllOverduePayments } = useInstallmentStore();
  const [overdueList, setOverdueList] = useState([
    {
      installment_id: 1,
      order_id: 101,
      user_id: 25,
      user_name: 'Nguyễn Văn A',
      user_phone: '0901234567',
      user_email: 'nguyenvana@email.com',
      payment_no: 3,
      due_date: '2025-11-15',
      amount: 5000000,
      days_overdue: 5,
      total_overdue_amount: 5000000,
      overdue_count: 1,
      severity: 'medium' // low, medium, high, critical
    },
    {
      installment_id: 2,
      order_id: 102,
      user_id: 30,
      user_name: 'Trần Thị B',
      user_phone: '0907654321',
      user_email: 'tranthib@email.com',
      payment_no: 5,
      due_date: '2025-11-01',
      amount: 3500000,
      days_overdue: 19,
      total_overdue_amount: 7000000,
      overdue_count: 2,
      severity: 'high'
    },
    {
      installment_id: 3,
      order_id: 105,
      user_id: 42,
      user_name: 'Lê Văn C',
      user_phone: '0912345678',
      user_email: 'levanc@email.com',
      payment_no: 2,
      due_date: '2025-10-20',
      amount: 4000000,
      days_overdue: 31,
      total_overdue_amount: 12000000,
      overdue_count: 3,
      severity: 'critical'
    }
  ]);

  const [stats, setStats] = useState({
    total_overdue: 0,
    total_amount: 0,
    critical_count: 0,
    high_count: 0,
    medium_count: 0
  });

  useEffect(() => {
    loadOverduePayments();
  }, []);

  useEffect(() => {
    // Update local state and calculate stats when overduePayments changes
    if (overduePayments && overduePayments.length > 0) {
      setOverdueList(overduePayments);
      calculateStats(overduePayments);
    } else {
      setOverdueList([]);
      setStats({
        total_overdue: 0,
        total_amount: 0,
        critical_count: 0,
        high_count: 0,
        medium_count: 0
      });
    }
  }, [overduePayments]);

  const loadOverduePayments = async () => {
    try {
      await fetchAllOverduePayments();
    } catch (error) {
      console.error('Error loading overdue payments:', error);
    }
  };

  const calculateStats = (payments) => {
    const stats = {
      total_overdue: payments.length,
      total_amount: payments.reduce((sum, p) => sum + (p.total_overdue_amount || p.amount || 0), 0),
      critical_count: payments.filter(p => p.severity === 'critical').length,
      high_count: payments.filter(p => p.severity === 'high').length,
      medium_count: payments.filter(p => p.severity === 'medium').length
    };
    setStats(stats);
  };

  const getSeverityBadge = (severity) => {
    const config = {
      low: { label: 'Nhẹ', className: 'bg-yellow-100 text-yellow-800' },
      medium: { label: 'Trung bình', className: 'bg-orange-100 text-orange-800' },
      high: { label: 'Cao', className: 'bg-red-100 text-red-800' },
      critical: { label: 'Nghiêm trọng', className: 'bg-red-600 text-white' }
    };
    
    const cfg = config[severity] || config.low;
    return <Badge className={cfg.className}>{cfg.label}</Badge>;
  };

  const handleSendReminder = (item) => {
    toast.success(`Đã gửi thông báo nhắc nhở đến ${item.user_name}`);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleRefresh = async () => {
    await loadOverduePayments();
  };

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng quá hạn</p>
                <p className="text-2xl font-bold text-red-600">{stats.total_overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng nợ quá hạn</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(stats.total_amount)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-600">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Nghiêm trọng</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical_count}</p>
              <p className="text-xs text-gray-500 mt-1">Quá hạn {'>'} 30 ngày</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Mức cao</p>
              <p className="text-2xl font-bold text-orange-600">{stats.high_count}</p>
              <p className="text-xs text-gray-500 mt-1">Quá hạn 15-30 ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Danh sách quá hạn
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overdueList.map((item) => (
              <Card key={item.installment_id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Customer Info */}
                    <div className="lg:col-span-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.user_name}</h3>
                          {getSeverityBadge(item.severity)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>{item.user_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs">{item.user_email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Info */}
                    <div className="lg:col-span-4">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-500">HĐ:</span>
                          <span className="font-mono font-semibold ml-2">#{item.installment_id}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Kỳ:</span>
                          <span className="font-semibold ml-2">#{item.payment_no}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Hạn:</span>
                          <span className="ml-2">{formatDate(item.due_date)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Quá hạn:</span>
                          <span className="font-semibold text-red-600 ml-2">
                            {item.days_overdue} ngày
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Kỳ này</p>
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tổng nợ quá hạn</p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.total_overdue_amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ({item.overdue_count} kỳ)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCall(item.user_phone)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Gọi
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEmail(item.user_email)}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSendReminder(item)}
                        >
                          Nhắc nhở
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm">Hướng dẫn xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-yellow-700">• Nhẹ (1-7 ngày):</span>
              <span>Gửi SMS/Email nhắc nhở tự động</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-orange-700">• Trung bình (8-14 ngày):</span>
              <span>Gọi điện nhắc nhở, gửi thông báo chính thức</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-red-700">• Cao (15-30 ngày):</span>
              <span>Liên hệ trực tiếp, đề xuất phương án thanh toán</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-red-900">• Nghiêm trọng ({'>'}30 ngày):</span>
              <span>Xem xét chuyển xử lý pháp lý, thu hồi tài sản</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverdueManagement;
