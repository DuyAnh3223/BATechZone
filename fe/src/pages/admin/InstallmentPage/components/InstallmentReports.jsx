import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useInstallmentStore } from '@/stores/useInstallmentStore';

const InstallmentReports = () => {
  const { installments, loading, fetchAllInstallments, fetchStatistics } = useInstallmentStore();
  const [dateRange, setDateRange] = useState('month'); // month, quarter, year
  const [reportType, setReportType] = useState('summary'); // summary, payments, overdue

  const [summaryStats, setSummaryStats] = useState({
    total_contracts: 45,
    active_contracts: 28,
    completed_contracts: 15,
    cancelled_contracts: 2,
    total_debt: 450000000,
    paid_amount: 180000000,
    remaining_amount: 270000000,
    overdue_amount: 15000000,
    collection_rate: 40, // %
    overdue_rate: 3.3 // %
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'T1/2025', contracts: 5, total: 50000000, paid: 20000000, overdue: 1000000 },
    { month: 'T2/2025', contracts: 8, total: 80000000, paid: 32000000, overdue: 2000000 },
    { month: 'T3/2025', contracts: 10, total: 100000000, paid: 40000000, overdue: 3000000 },
    { month: 'T4/2025', contracts: 12, total: 120000000, paid: 48000000, overdue: 4000000 },
    { month: 'T5/2025', contracts: 10, total: 100000000, paid: 40000000, overdue: 5000000 }
  ]);

  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calculate stats from installments data
    if (installments && installments.length > 0) {
      calculateSummaryStats(installments);
      calculateMonthlyData(installments);
      calculateTopCustomers(installments);
    }
  }, [installments]);

  const loadData = async () => {
    try {
      await fetchAllInstallments();
      const statsResponse = await fetchStatistics();
      if (statsResponse) {
        setSummaryStats(statsResponse);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const calculateSummaryStats = (data) => {
    const stats = {
      total_contracts: data.length,
      active_contracts: data.filter(i => i.status === 'active').length,
      completed_contracts: data.filter(i => i.status === 'completed').length,
      cancelled_contracts: data.filter(i => i.status === 'cancelled').length,
      total_debt: data.reduce((sum, i) => sum + (i.total_amount || 0), 0),
      paid_amount: data.reduce((sum, i) => sum + ((i.total_amount || 0) - (i.remaining_amount || 0)), 0),
      remaining_amount: data.reduce((sum, i) => sum + (i.remaining_amount || 0), 0),
      overdue_amount: data.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.remaining_amount || 0), 0),
    };
    stats.collection_rate = stats.total_debt > 0 ? ((stats.paid_amount / stats.total_debt) * 100).toFixed(1) : 0;
    stats.overdue_rate = stats.total_debt > 0 ? ((stats.overdue_amount / stats.total_debt) * 100).toFixed(1) : 0;
    setSummaryStats(stats);
  };

  const calculateMonthlyData = (data) => {
    // Group by month
    const monthlyMap = {};
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = `T${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, contracts: 0, total: 0, paid: 0, overdue: 0 };
      }
      monthlyMap[monthKey].contracts++;
      monthlyMap[monthKey].total += item.total_amount || 0;
      monthlyMap[monthKey].paid += (item.total_amount || 0) - (item.remaining_amount || 0);
      if (item.status === 'overdue') {
        monthlyMap[monthKey].overdue += item.remaining_amount || 0;
      }
    });
    setMonthlyData(Object.values(monthlyMap).slice(-5)); // Last 5 months
  };

  const calculateTopCustomers = (data) => {
    // Group by user
    const userMap = {};
    data.forEach(item => {
      if (!userMap[item.user_id]) {
        userMap[item.user_id] = {
          id: item.user_id,
          name: item.user_name || `User ${item.user_id}`,
          contracts: 0,
          total: 0,
          paid: 0,
          status: item.status
        };
      }
      userMap[item.user_id].contracts++;
      userMap[item.user_id].total += item.total_amount || 0;
      userMap[item.user_id].paid += (item.total_amount || 0) - (item.remaining_amount || 0);
    });
    const sorted = Object.values(userMap).sort((a, b) => b.total - a.total).slice(0, 5);
    setTopCustomers(sorted);
  };

  const handleExport = (format) => {
    toast.success(`Đang xuất báo cáo định dạng ${format.toUpperCase()}...`);
    // TODO: Implement export logic
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    toast.info(`Đã chọn khoảng thời gian: ${value === 'month' ? 'Tháng này' : value === 'quarter' ? 'Quý này' : 'Năm này'}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                  <SelectItem value="all">Toàn bộ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Tổng quan</SelectItem>
                  <SelectItem value="payments">Thanh toán</SelectItem>
                  <SelectItem value="overdue">Quá hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng hợp đồng</p>
                <p className="text-2xl font-bold">{summaryStats.total_contracts}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Hoạt động: {summaryStats.active_contracts}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng giá trị</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(summaryStats.total_debt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Còn lại: {formatCurrency(summaryStats.remaining_amount)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đã thu</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(summaryStats.paid_amount)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-semibold">
                    {summaryStats.collection_rate}%
                  </span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quá hạn</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(summaryStats.overdue_amount)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600 font-semibold">
                    {summaryStats.overdue_rate}%
                  </span>
                </div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Xu hướng theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tháng</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">HĐ mới</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Tổng giá trị</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Đã thu</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Quá hạn</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Tỷ lệ thu</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.month}</td>
                    <td className="py-3 px-4 text-right">{item.contracts}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.total)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">
                      {formatCurrency(item.paid)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {formatCurrency(item.overdue)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {((item.paid / item.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr>
                  <td className="py-3 px-4">Tổng</td>
                  <td className="py-3 px-4 text-right">
                    {monthlyData.reduce((sum, item) => sum + item.contracts, 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(monthlyData.reduce((sum, item) => sum + item.total, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600">
                    {formatCurrency(monthlyData.reduce((sum, item) => sum + item.paid, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    {formatCurrency(monthlyData.reduce((sum, item) => sum + item.overdue, 0))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {((monthlyData.reduce((sum, item) => sum + item.paid, 0) / 
                       monthlyData.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="mt-6 space-y-2">
            {monthlyData.map((item, index) => {
              const maxTotal = Math.max(...monthlyData.map(d => d.total));
              const widthPercent = (item.total / maxTotal) * 100;
              const paidPercent = (item.paid / item.total) * 100;
              const overduePercent = (item.overdue / item.total) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium text-gray-700">{item.month}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded overflow-hidden flex" 
                         style={{ width: `${widthPercent}%`, minWidth: '150px' }}>
                      <div 
                        className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${paidPercent}%` }}
                      >
                        {paidPercent > 15 && `${paidPercent.toFixed(0)}%`}
                      </div>
                      <div 
                        className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${overduePercent}%` }}
                      >
                        {overduePercent > 5 && `${overduePercent.toFixed(0)}%`}
                      </div>
                      <div className="flex-1 bg-blue-200"></div>
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm font-medium">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Đã thu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Quá hạn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span>Chưa đến hạn</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Khách hàng nổi bật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Khách hàng</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Số HĐ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Tổng giá trị</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Đã thanh toán</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-center">{customer.contracts}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(customer.total)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">
                      {formatCurrency(customer.paid)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {customer.status === 'active' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Đang trả
                        </span>
                      )}
                      {customer.status === 'completed' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Hoàn thành
                        </span>
                      )}
                      {customer.status === 'overdue' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Quá hạn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallmentReports;
