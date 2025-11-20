import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

const InstallmentPolicies = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Trả góp 3 tháng',
      terms: 3,
      interest_rate: 0,
      min_down_payment: 30,
      is_active: true
    },
    {
      id: 2,
      name: 'Trả góp 6 tháng',
      terms: 6,
      interest_rate: 2,
      min_down_payment: 20,
      is_active: true
    },
    {
      id: 3,
      name: 'Trả góp 12 tháng',
      terms: 12,
      interest_rate: 5,
      min_down_payment: 10,
      is_active: true
    },
    {
      id: 4,
      name: 'Trả góp 24 tháng',
      terms: 24,
      interest_rate: 8,
      min_down_payment: 10,
      is_active: false
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    terms: '',
    interest_rate: '',
    min_down_payment: ''
  });

  const handleCreate = () => {
    setEditingPolicy(null);
    setFormData({
      name: '',
      terms: '',
      interest_rate: '',
      min_down_payment: ''
    });
    setShowDialog(true);
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      terms: policy.terms.toString(),
      interest_rate: policy.interest_rate.toString(),
      min_down_payment: policy.min_down_payment.toString()
    });
    setShowDialog(true);
  };

  const handleDelete = (policyId) => {
    if (confirm('Bạn có chắc muốn xóa chính sách này?')) {
      setPolicies(policies.filter(p => p.id !== policyId));
      toast.success('Đã xóa chính sách');
    }
  };

  const handleToggleActive = (policyId) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, is_active: !p.is_active } : p
    ));
    toast.success('Đã cập nhật trạng thái');
  };

  const handleSave = () => {
    if (!formData.name || !formData.terms || formData.interest_rate === '' || formData.min_down_payment === '') {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const policyData = {
      name: formData.name,
      terms: parseInt(formData.terms),
      interest_rate: parseFloat(formData.interest_rate),
      min_down_payment: parseFloat(formData.min_down_payment),
      is_active: true
    };

    if (editingPolicy) {
      // Update
      setPolicies(policies.map(p => 
        p.id === editingPolicy.id ? { ...p, ...policyData } : p
      ));
      toast.success('Đã cập nhật chính sách');
    } else {
      // Create
      setPolicies([...policies, { ...policyData, id: Date.now() }]);
      toast.success('Đã tạo chính sách mới');
    }

    setShowDialog(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chính sách trả góp</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chính sách
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.id} className={!policy.is_active ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{policy.name}</h3>
                        {policy.is_active ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Đang áp dụng
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            Tạm ngưng
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Kỳ hạn:</span>
                          <span className="font-semibold ml-2">{policy.terms} tháng</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lãi suất:</span>
                          <span className="font-semibold ml-2">{policy.interest_rate}% / năm</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Trả trước tối thiểu:</span>
                          <span className="font-semibold ml-2">{policy.min_down_payment}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(policy.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(policy)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(policy.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPolicy ? 'Chỉnh sửa chính sách' : 'Thêm chính sách mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Tên chính sách</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Trả góp 6 tháng"
              />
            </div>

            <div>
              <Label htmlFor="terms">Số kỳ (tháng)</Label>
              <Input
                id="terms"
                type="number"
                min="1"
                max="36"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="VD: 6"
              />
            </div>

            <div>
              <Label htmlFor="interest_rate">Lãi suất (% / năm)</Label>
              <Input
                id="interest_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.interest_rate}
                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                placeholder="VD: 5"
              />
            </div>

            <div>
              <Label htmlFor="min_down_payment">Trả trước tối thiểu (%)</Label>
              <Input
                id="min_down_payment"
                type="number"
                min="0"
                max="100"
                value={formData.min_down_payment}
                onChange={(e) => setFormData({ ...formData, min_down_payment: e.target.value })}
                placeholder="VD: 20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingPolicy ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstallmentPolicies;
