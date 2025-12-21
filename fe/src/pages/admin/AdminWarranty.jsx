import React, { useMemo, useState } from 'react';
import { translateWarrantyStatus, translateWarrantyType } from '../../utils/statusTranslations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const warranties = [
  {
    warranty_id: 1,
    order_item_id: 1,
    service_request_id: null,
    warranty_period: 36,
    warranty_type: 'manufacturer',
    start_date: '2024-05-01',
    end_date: '2027-05-01',
    status: 'active',
    notes: 'Bảo hành hãng 36 tháng',
  },
  {
    warranty_id: 2,
    order_item_id: 2,
    service_request_id: 10,
    warranty_period: 36,
    warranty_type: 'manufacturer',
    start_date: '2024-05-01',
    end_date: '2027-05-01',
    status: 'active',
    notes: 'Đã yêu cầu kiểm tra',
  }
];

const statusClass = (s) => (
  s === 'active' ? 'bg-green-100 text-green-700' :
  s === 'expired' ? 'bg-gray-100 text-gray-600' :
  s === 'claimed' ? 'bg-yellow-100 text-yellow-700' : 'bg-pink-100 text-pink-700'
);

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminWarranty = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    warranty_type: '',
    notes: '',
    warranty_period: '',
    start_date: '',
    end_date: '',
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return warranties.filter(w => {
      const matchText = !q || String(w.warranty_id).includes(q) || String(w.order_item_id).includes(q);
      const matchStatus = !status || w.status === status;
      const matchType = !type || w.warranty_type === type;
      return matchText && matchStatus && matchType;
    });
  }, [search, status, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const handleOpenUpdateDialog = (warranty) => {
    setSelectedWarranty(warranty);
    setFormData({
      status: warranty.status,
      warranty_type: warranty.warranty_type,
      notes: warranty.notes || '',
      warranty_period: warranty.warranty_period,
      start_date: warranty.start_date,
      end_date: warranty.end_date,
    });
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedWarranty(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log('Updating warranty:', selectedWarranty.warranty_id, formData);
    handleCloseUpdateDialog();
  };

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý bảo hành (Warranty)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Tạo bảo hành</button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo Warranty ID/Order Item ID..." />
      <select value={type} onChange={(e)=>{ setType(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả loại</option>
        <option value="manufacturer">Hãng</option>
        <option value="store">Cửa hàng</option>
      </select>
      <select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả trạng thái</option>
        <option value="active">Đang hiệu lực</option>
        <option value="expired">Hết hạn</option>
        <option value="claimed">Đã claim</option>
      </select>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500">Hiển thị</span>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-sm text-gray-500">mục/trang</span>
      </div>
    </div>

    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1200px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">ID Chi tiết đơn</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Yêu cầu dịch vụ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thời hạn (tháng)</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Bắt đầu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kết thúc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ghi chú</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginated.map(w => (
            <tr key={w.warranty_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{w.warranty_id}</td>
              <td className="px-4 py-3">{w.order_item_id}</td>
              <td className="px-4 py-3">{w.service_request_id || '-'}</td>
              <td className="px-4 py-3">{w.warranty_period}</td>
              <td className="px-4 py-3">{translateWarrantyType(w.warranty_type)}</td>
              <td className="px-4 py-3">{w.start_date}</td>
              <td className="px-4 py-3">{w.end_date}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(w.status)}`}>{translateWarrantyStatus(w.status)}</span></td>
              <td className="px-4 py-3 max-w-[240px] truncate" title={w.notes || ''}>{w.notes || '-'}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <button 
                  onClick={() => handleOpenUpdateDialog(w)}
                  className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Hủy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Phân trang */}
    <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
      <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> bảo hành — Trang {currentPage}/{totalPages}</div>
      <div className="flex items-center gap-1">
        <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
        {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
          const p = i+1; return (
            <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
          );
        })}
        <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
      </div>
    </div>

    {/* Dialog cập nhật trạng thái bảo hành */}
    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cập nhật trạng thái bảo hành #{selectedWarranty?.warranty_id}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {selectedWarranty && (
            <form onSubmit={handleUpdateSubmit} className="space-y-6 py-2">
            {/* Thông tin cơ bản */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-700 mb-3">Thông tin bảo hành</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Bảo hành</label>
                  <input 
                    type="text" 
                    value={selectedWarranty.warranty_id} 
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Chi tiết đơn hàng</label>
                  <input 
                    type="text" 
                    value={selectedWarranty.order_item_id} 
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Yêu cầu dịch vụ</label>
                <input 
                  type="text" 
                  value={selectedWarranty.service_request_id || 'Chưa có'} 
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100" 
                />
              </div>
            </div>

            {/* Trạng thái bảo hành */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Trạng thái và loại bảo hành</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                <select 
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="active">Đang hiệu lực</option>
                  <option value="expired">Hết hạn</option>
                  <option value="claimed">Đã claim</option>
                  <option value="voided">Hủy bỏ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bảo hành <span className="text-red-500">*</span></label>
                <select 
                  value={formData.warranty_type}
                  onChange={(e) => handleFormChange('warranty_type', e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="manufacturer">Bảo hành hãng</option>
                  <option value="store">Bảo hành cửa hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn bảo hành (tháng) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.warranty_period}
                  onChange={(e) => handleFormChange('warranty_period', e.target.value)}
                  required
                  min="1"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>

            {/* Ngày bắt đầu và kết thúc */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Thời gian bảo hành</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formData.start_date}
                    onChange={(e) => handleFormChange('start_date', e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formData.end_date}
                    onChange={(e) => handleFormChange('end_date', e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Ghi chú và lịch sử</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows="4"
                  placeholder="Nhập ghi chú về bảo hành..."
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
                />
              </div>

              {/* Lịch sử thay đổi trạng thái */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Lịch sử thay đổi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 pb-2 border-b">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">Trạng thái: {translateWarrantyStatus(selectedWarranty.status)}</div>
                      <div className="text-gray-500 text-xs">2024-05-01 10:30 - Admin User</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">Tạo bảo hành</div>
                      <div className="text-gray-500 text-xs">{selectedWarranty.start_date} 10:00 - System</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết kỹ thuật */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-700">Thông tin thêm</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Loại bảo hành:</span>
                  <span className="font-medium text-gray-800 ml-2">{translateWarrantyType(selectedWarranty.warranty_type)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium text-gray-800 ml-2">{selectedWarranty.warranty_period} tháng</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseUpdateDialog}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-lg font-medium shadow"
              >
                Cập nhật
              </button>
            </div>
          </form>
        )}
        </div>
      </DialogContent>
    </Dialog>
  </section>
  );
};

export default AdminWarranty;
