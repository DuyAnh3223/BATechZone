import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { useCouponStore } from '@/stores/useCouponStore';
import { couponService } from '@/services/couponService';
import { translateOrderStatus, translatePaymentStatus } from '@/utils/statusTranslations';
import AdminCouponList from './AdminCouponList';
import AdminCouponForm from './AdminCouponForm';

const AdminCouponPage = () => {
  const { 
    coupons, 
    total,
    loading, 
    fetchCoupons,
    deleteCoupon
  } = useCouponStore();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponOrders, setCouponOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize] = useState(10);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadCoupons = async () => {
    try {
      await fetchCoupons({
        search: search.trim(),
        discount_type: type === 'fixed' ? 'fixed_amount' : type,
        is_active: active || undefined,
        page,
        pageSize
      });
    } catch (error) {
      toast.error('Không thể tải danh sách coupon', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      console.error('Error loading coupons:', error);
    }
  };

  useEffect(() => {
    loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, active, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handleAdd = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleDelete = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    try {
      const couponCode = couponToDelete.coupon_code || 'coupon';
      await deleteCoupon(couponToDelete.coupon_id);
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
      loadCoupons();
      
      // Hiển thị success dialog
      setSuccessMessage(`Đã xóa coupon ${couponCode} thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleDetail = async (coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailDialogOpen(true);
    setOrdersPage(1);
    await loadCouponOrders(coupon.coupon_id, 1);
  };

  const loadCouponOrders = async (couponId, page = 1) => {
    try {
      setOrdersLoading(true);
      const response = await couponService.getCouponOrders(couponId, {
        page,
        limit: ordersPageSize
      });
      const ordersData = response.data || [];
      const totalData = response.pagination?.total || 0;
      setCouponOrders(Array.isArray(ordersData) ? ordersData : []);
      setOrdersTotal(totalData);
      setOrdersPage(page);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      console.error('Error loading coupon orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleFormSubmit = (response, isUpdate = false) => {
    const couponCode = response?.data?.coupon_code || response?.coupon_code || editingCoupon?.coupon_code || '';
    setIsFormOpen(false);
    setEditingCoupon(null);
    loadCoupons();
    
    // Hiển thị success dialog
    if (isUpdate) {
      setSuccessMessage(`Đã cập nhật coupon ${couponCode} thành công!`);
    } else {
      setSuccessMessage(`Đã tạo coupon ${couponCode} thành công!`);
    }
    setIsSuccessDialogOpen(true);
  };

  const ordersTotalPages = Math.max(1, Math.ceil(ordersTotal / ordersPageSize));
  const ordersCurrentPage = Math.min(ordersPage, ordersTotalPages);

  const getOrderStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipping': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-cyan-100 text-cyan-700';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'unpaid': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quản lý mã giảm giá/Coupon</h2>
        <div>
          <button 
            onClick={handleAdd}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Thêm coupon
          </button>
        </div>
      </div>

      {/* Bộ lọc nhanh */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2 w-full md:w-72" 
          placeholder="Tìm theo mã/miêu tả..." 
        />
        <select 
          value={type} 
          onChange={(e) => { setType(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả loại</option>
          <option value="percentage">Phần trăm</option>
          <option value="fixed">Số tiền (VNĐ)</option>
        </select>
        <select 
          value={active} 
          onChange={(e) => { setActive(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="true">Kích hoạt</option>
          <option value="false">Vô hiệu</option>
        </select>
      </div>

      <AdminCouponList
        coupons={coupons}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />

      {/* Form Dialog */}
      <AdminCouponForm
        initialData={editingCoupon}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCoupon(null);
        }}
        onSubmit={(response) => handleFormSubmit(response, !!editingCoupon)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setCouponToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa coupon</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa coupon <span className="font-semibold text-red-600">{couponToDelete?.coupon_code}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCouponToDelete(null);
              }}
            >
              Đóng
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupon Orders Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={(open) => {
        setIsDetailDialogOpen(open);
        if (!open) {
          setSelectedCoupon(null);
          setCouponOrders([]);
          setOrdersPage(1);
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đơn hàng đã sử dụng coupon: {selectedCoupon?.coupon_code}</DialogTitle>
            <DialogDescription>
              Danh sách đơn hàng đã sử dụng coupon này ({selectedCoupon?.used_count || 0} lượt sử dụng)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : couponOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có đơn hàng nào sử dụng coupon này
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">ID Đơn</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Mã đơn hàng</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Khách hàng</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái đơn</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Thanh toán</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {couponOrders.map((order) => (
                        <tr key={order.order_id || order.orderId} className="hover:bg-blue-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-800">{order.order_id || order.orderId}</td>
                          <td className="px-4 py-3 font-semibold text-blue-800">{order.order_number || order.orderNumber}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium">{order.username || '-'}</div>
                              <div className="text-gray-500 text-xs">{order.email || '-'}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.order_status || order.orderStatus)}`}>
                              {translateOrderStatus(order.order_status || order.orderStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusClass(order.payment_status || order.paymentStatus)}`}>
                              {translatePaymentStatus(order.payment_status || order.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-700">
                            {Number(order.total_amount || order.totalAmount || 0).toLocaleString()} ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination for orders */}
                {ordersTotalPages > 1 && (
                  <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 border-t">
                    <div>
                      Tổng: <span className="font-medium text-gray-800">{ordersTotal}</span> đơn hàng — 
                      Trang {ordersCurrentPage}/{ordersTotalPages}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => loadCouponOrders(selectedCoupon?.coupon_id, ordersCurrentPage - 1)} 
                        disabled={ordersCurrentPage === 1} 
                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
                      >
                        Trước
                      </button>
                      {Array.from({ length: Math.min(5, ordersTotalPages) }).map((_, i) => {
                        const p = i + 1;
                        return (
                          <button 
                            key={p} 
                            onClick={() => loadCouponOrders(selectedCoupon?.coupon_id, p)} 
                            className={`px-3 py-1 rounded border ${
                              p === ordersCurrentPage 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                      <button 
                        onClick={() => loadCouponOrders(selectedCoupon?.coupon_id, ordersCurrentPage + 1)} 
                        disabled={ordersCurrentPage === ordersTotalPages} 
                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDetailDialogOpen(false);
                setSelectedCoupon(null);
                setCouponOrders([]);
                setOrdersPage(1);
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={(open) => {
        setIsSuccessDialogOpen(open);
        if (!open) {
          setSuccessMessage('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                setSuccessMessage('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCouponPage;

