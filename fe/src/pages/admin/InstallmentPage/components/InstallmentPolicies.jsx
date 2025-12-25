import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useInstallmentPolicyStore } from '@/stores/useInstallmentPolicyStore';
import { toast } from 'sonner';

const InstallmentPolicies = () => {
  const { 
    policies, 
    loading, 
    fetchAllPolicies, 
    createPolicy, 
    updatePolicy, 
    deletePolicy, 
    togglePolicyStatus 
  } = useInstallmentPolicyStore();

  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    terms: '',
    interest_rate: '',
    min_down_payment: '',
    description: '',
    installment_fee_percent: '',
    overdue_fee_percent: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Load policies on mount
  useEffect(() => {
    fetchAllPolicies();
  }, [fetchAllPolicies]);

  const handleCreate = () => {
    setEditingPolicy(null);
    setFormData({
      name: '',
      terms: '',
      interest_rate: '',
      min_down_payment: '',
      description: '',
      installment_fee_percent: '',
      overdue_fee_percent: ''
    });
    setFormErrors({});
    setShowDialog(true);
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      terms: policy.terms.toString(),
      interest_rate: policy.interest_rate.toString(),
      min_down_payment: policy.min_down_payment.toString(),
      description: policy.description || '',
      installment_fee_percent: policy.installment_fee_percent?.toString() || '0',
      overdue_fee_percent: policy.overdue_fee_percent?.toString() || '0'
    });
    setFormErrors({});
    setShowDialog(true);
  };

  const handleDelete = (policyId) => {
    setDeletingPolicyId(policyId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePolicy(deletingPolicyId);
      setShowDeleteDialog(false);
      const policyName = policies.find(p => p.policy_id === deletingPolicyId)?.name || '';
      setDeletingPolicyId(null);
      
      // Hiển thị success dialog
      setSuccessMessage(`Đã xóa chính sách "${policyName}" thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  const handleToggleActive = async (policyId) => {
    try {
      const policy = policies.find(p => p.policy_id === policyId);
      const newStatus = policy?.is_active === 1 ? 0 : 1;
      await togglePolicyStatus(policyId);
      
      // Hiển thị success dialog
      const message = newStatus === 1 
        ? `Đã kích hoạt chính sách "${policy?.name}" thành công!`
        : `Đã tạm ngưng chính sách "${policy?.name}" thành công!`;
      setSuccessMessage(message);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error toggling policy status:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Tên chính sách
    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = 'Tên chính sách không được để trống';
    } else if (formData.name.trim().length < 5) {
      errors.name = 'Tên chính sách phải có ít nhất 5 ký tự';
    }

    // Số kỳ
    const terms = parseInt(formData.terms);
    if (!formData.terms || formData.terms === '') {
      errors.terms = 'Số kỳ không được để trống';
    } else if (isNaN(terms) || terms <= 0) {
      errors.terms = 'Số kỳ phải là số nguyên dương';
    } else if (terms > 36) {
      errors.terms = 'Số kỳ không được vượt quá 36 tháng';
    }

    // Lãi suất
    const interestRate = parseFloat(formData.interest_rate);
    if (formData.interest_rate === '') {
      errors.interest_rate = 'Lãi suất không được để trống';
    } else if (isNaN(interestRate) || interestRate < 0) {
      errors.interest_rate = 'Lãi suất phải lớn hơn hoặc bằng 0';
    } else if (interestRate > 100) {
      errors.interest_rate = 'Lãi suất không được vượt quá 100%';
    }

    // Trả trước tối thiểu
    const minDownPayment = parseFloat(formData.min_down_payment);
    if (formData.min_down_payment === '') {
      errors.min_down_payment = 'Trả trước tối thiểu không được để trống';
    } else if (isNaN(minDownPayment) || minDownPayment < 0) {
      errors.min_down_payment = 'Trả trước tối thiểu phải lớn hơn hoặc bằng 0';
    } else if (minDownPayment > 100) {
      errors.min_down_payment = 'Trả trước tối thiểu không được vượt quá 100%';
    }

    // Phí trả góp ( mặc định = 0)
    if (formData.installment_fee_percent !== '') {
      const installmentFee = parseFloat(formData.installment_fee_percent);
      if (isNaN(installmentFee) || installmentFee < 0) {
        errors.installment_fee_percent = 'Phí trả góp phải lớn hơn hoặc bằng 0';
      } else if (installmentFee > 100) {
        errors.installment_fee_percent = 'Phí trả góp không được vượt quá 100%';
      }
    }

    // Phí quá hạn (mặc định = 0)
    if (formData.overdue_fee_percent !== '') {
      const overdueFee = parseFloat(formData.overdue_fee_percent);
      if (isNaN(overdueFee) || overdueFee < 0) {
        errors.overdue_fee_percent = 'Phí quá hạn phải lớn hơn hoặc bằng 0';
      } else if (overdueFee > 100) {
        errors.overdue_fee_percent = 'Phí quá hạn không được vượt quá 100%';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClick = () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    try {
      const policyData = {
        name: formData.name.trim(),
        terms: parseInt(formData.terms),
        interest_rate: parseFloat(formData.interest_rate),
        min_down_payment: parseFloat(formData.min_down_payment),
        description: formData.description.trim(),
        installment_fee_percent: formData.installment_fee_percent ? parseFloat(formData.installment_fee_percent) : 0,
        overdue_fee_percent: formData.overdue_fee_percent ? parseFloat(formData.overdue_fee_percent) : 0
      };

      if (editingPolicy) {
        // Update
        await updatePolicy(editingPolicy.policy_id, policyData);
        setSuccessMessage(`Đã cập nhật chính sách "${policyData.name}" thành công!`);
      } else {
        // Create
        policyData.is_active = 1;
        await createPolicy(policyData);
        setSuccessMessage(`Đã tạo chính sách "${policyData.name}" thành công!`);
      }

      setShowDialog(false);
      setShowConfirmDialog(false);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error saving policy:', error);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Chính sách trả góp</CardTitle>
            <CardDescription className="mt-1">
              Quản lý các gói trả góp cho khách hàng
            </CardDescription>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Thêm chính sách
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có chính sách trả góp nào</p>
                <p className="text-sm mt-1">Nhấn "Thêm chính sách" để tạo mới</p>
              </div>
            ) : (
              policies.map((policy) => (
                <Card key={policy.id} className={!policy.is_active ? 'opacity-60' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-lg">{policy.name}</h3>
                          {policy.is_active ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Đang áp dụng
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                              Tạm ngưng
                            </span>
                          )}
                        </div>
                        
                        {policy.description && (
                          <p className="text-sm text-gray-600 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            {policy.description}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-sm">
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                            <span className="text-gray-600">Kỳ hạn:</span>
                            <span className="font-semibold text-blue-900">{policy.terms} tháng</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                            <span className="text-gray-600">Lãi suất:</span>
                            <span className="font-semibold text-green-900">{policy.interest_rate}% / năm</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                            <span className="text-gray-600">Trả trước:</span>
                            <span className="font-semibold text-purple-900">≥ {policy.min_down_payment}%</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                            <span className="text-gray-600">Phí:</span>
                            <span className="font-semibold text-purple-900"> {policy.installment_fee_percent}%</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                            <span className="text-gray-600">Phí quá hạn:</span>
                            <span className="font-semibold text-red-900"> {policy.overdue_fee_percent}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex lg:flex-col gap-2 flex-wrap lg:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(policy.policy_id)}
                          className="flex-1 lg:flex-none"
                          disabled={loading}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          {policy.is_active ? 'Tạm ngưng' : 'Kích hoạt'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                          className="flex-1 lg:flex-none"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(policy.policy_id)}
                          className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPolicy ? 'Chỉnh sửa chính sách trả góp' : 'Thêm chính sách trả góp mới'}
            </DialogTitle>
            <DialogDescription>
              {editingPolicy 
                ? 'Cập nhật thông tin chính sách trả góp. Các thay đổi sẽ cần xác nhận.'
                : 'Điền đầy đủ thông tin để tạo chính sách trả góp mới.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-1">
                Tên chính sách <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                placeholder="VD: Trả góp 6 tháng - Lãi suất ưu đãi"
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Mô tả / Ghi chú</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="VD: Phù hợp cho khách hàng muốn trả nhanh, không phát sinh lãi suất cao"
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mô tả chi tiết về chính sách, điều kiện áp dụng, ưu điểm...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="terms" className="flex items-center gap-1">
                  Số kỳ (tháng) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="terms"
                  type="number"
                  min="1"
                  max="36"
                  value={formData.terms}
                  onChange={(e) => {
                    setFormData({ ...formData, terms: e.target.value });
                    if (formErrors.terms) setFormErrors({ ...formErrors, terms: '' });
                  }}
                  placeholder="VD: 6"
                  className={formErrors.terms ? 'border-red-500' : ''}
                />
                {formErrors.terms && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.terms}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Từ 1 đến 36 tháng</p>
              
              </div>
              <div>
                <Label htmlFor="installment_fee_percent" className="flex items-center gap-1">
                  Phí trả góp (%)
                </Label>
                <Input
                  id="installment_fee_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.installment_fee_percent}
                  onChange={(e) => {
                    setFormData({ ...formData, installment_fee_percent: e.target.value });
                    if (formErrors.installment_fee_percent) setFormErrors({ ...formErrors, installment_fee_percent: '' });
                  }}
                  placeholder="0 (Mặc định nếu để trống)"
                  className={formErrors.installment_fee_percent ? 'border-red-500' : ''}
                />
                {formErrors.installment_fee_percent && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.installment_fee_percent}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Từ 0% đến 100% (Tùy chọn, mặc định: 0%)</p>
              
              </div>
              
              <div>
                <Label htmlFor="overdue_fee_percent" className="flex items-center gap-1">
                  Phí quá hạn (%)
                </Label>
                <Input
                  id="overdue_fee_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.overdue_fee_percent}
                  onChange={(e) => {
                    setFormData({ ...formData, overdue_fee_percent: e.target.value });
                    if (formErrors.overdue_fee_percent) setFormErrors({ ...formErrors, overdue_fee_percent: '' });
                  }}
                  placeholder="0 (Mặc định nếu để trống)"
                  className={formErrors.overdue_fee_percent ? 'border-red-500' : ''}
                />
                {formErrors.overdue_fee_percent && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.overdue_fee_percent}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Phí phạt khi trễ hạn thanh toán (Tùy chọn, mặc định: 0%)</p>
              </div>
              

              <div>
                <Label htmlFor="interest_rate" className="flex items-center gap-1">
                  Lãi suất (% / năm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="interest_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => {
                    setFormData({ ...formData, interest_rate: e.target.value });
                    if (formErrors.interest_rate) setFormErrors({ ...formErrors, interest_rate: '' });
                  }}
                  placeholder="VD: 5"
                  className={formErrors.interest_rate ? 'border-red-500' : ''}
                />
                {formErrors.interest_rate && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.interest_rate}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Từ 0% đến 100%</p>
              </div>
            </div>

            <div>
              <Label htmlFor="min_down_payment" className="flex items-center gap-1">
                Trả trước tối thiểu (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="min_down_payment"
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.min_down_payment}
                onChange={(e) => {
                  setFormData({ ...formData, min_down_payment: e.target.value });
                  if (formErrors.min_down_payment) setFormErrors({ ...formErrors, min_down_payment: '' });
                }}
                placeholder="VD: 20"
                className={formErrors.min_down_payment ? 'border-red-500' : ''}
              />
              {formErrors.min_down_payment && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.min_down_payment}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Phần trăm giá trị đơn hàng khách phải trả trước (0% - 100%)
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Xem trước:</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Tên: <span className="font-semibold">{formData.name || '(Chưa nhập)'}</span></p>
                <p>• Kỳ hạn: <span className="font-semibold">{formData.terms || '0'} tháng</span></p>
                <p>• Lãi suất: <span className="font-semibold">{formData.interest_rate || '0'}% / năm</span></p>
                <p>• Trả trước: <span className="font-semibold">≥ {formData.min_down_payment || '0'}%</span></p>
                <p>• Phí trả góp: <span className="font-semibold">{formData.installment_fee_percent || '0'}%</span></p>
                <p>• Phí quá hạn: <span className="font-semibold">{formData.overdue_fee_percent || '0'}%</span></p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="w-full sm:w-auto" disabled={loading}>
              Hủy
            </Button>
            <Button onClick={handleSaveClick} className="w-full sm:w-auto" disabled={loading}>
              {loading ? 'Đang xử lý...' : (editingPolicy ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Save */}
      {showConfirmDialog && (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận {editingPolicy ? 'cập nhật' : 'tạo mới'}</DialogTitle>
              <DialogDescription>
                {editingPolicy 
                  ? `Bạn có chắc chắn muốn cập nhật chính sách "${formData.name}"? Thay đổi này sẽ ảnh hưởng đến tất cả đơn hàng trả góp mới.`
                  : `Bạn có chắc chắn muốn tạo chính sách "${formData.name}"? Chính sách mới sẽ có sẵn cho khách hàng ngay lập tức.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Hủy
              </Button>
              <Button onClick={confirmSave}>
                Xác nhận {editingPolicy ? 'cập nhật' : 'tạo mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog for Delete */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Xác nhận xóa chính sách
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa chính sách này? Hành động này không thể hoàn tác.
                {deletingPolicyId && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800 font-medium">
                      Chính sách: {policies.find(p => p.policy_id === deletingPolicyId)?.name}
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button 
                onClick={confirmDelete}
                variant="destructive"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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

export default InstallmentPolicies;
