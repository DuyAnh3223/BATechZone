import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { categoryService } from '@/services/categoryService';

const CompatibilityRuleForm = () => {
  const navigate = useNavigate();
  const { ruleId } = useParams();
  const isEditMode = !!ruleId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [attributes1, setAttributes1] = useState([]);
  const [attributes2, setAttributes2] = useState([]);

  const [formData, setFormData] = useState({
    rule_name: '',
    category_1_id: '',
    attribute_1_id: '',
    category_2_id: '',
    attribute_2_id: '',
    match_type: 'exact',
    is_active: 1,
    note: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchRuleDetails();
    }
  }, [ruleId]);

  useEffect(() => {
    if (formData.category_1_id) {
      fetchAttributes(formData.category_1_id, 1);
    }
  }, [formData.category_1_id]);

  useEffect(() => {
    if (formData.category_2_id) {
      fetchAttributes(formData.category_2_id, 2);
    }
  }, [formData.category_2_id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh sách categories');
      setCategories([]);
    }
  };

  const fetchAttributes = async (categoryId, position) => {
    try {
      const response = await categoryService.getAttributesByCategory(categoryId);
      const attributesData = Array.isArray(response.data) ? response.data : [];
      if (position === 1) {
        setAttributes1(attributesData);
      } else {
        setAttributes2(attributesData);
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
      if (position === 1) {
        setAttributes1([]);
      } else {
        setAttributes2([]);
      }
    }
  };

  const fetchRuleDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/compatibility/rules/${ruleId}`);
      if (response.data.success) {
        const rule = response.data.data;
        setFormData({
          rule_name: rule.rule_name,
          category_1_id: rule.category_1_id,
          attribute_1_id: rule.attribute_1_id,
          category_2_id: rule.category_2_id,
          attribute_2_id: rule.attribute_2_id,
          match_type: rule.match_type,
          is_active: rule.is_active,
          note: rule.note || '',
        });
      }
    } catch (error) {
      console.error('Error fetching rule:', error);
      toast.error('Không thể tải thông tin rule');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.rule_name || !formData.category_1_id || !formData.attribute_1_id ||
        !formData.category_2_id || !formData.attribute_2_id) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
        console.log('📤 Sending rule data:', formData);
      if (isEditMode) {
        const response = await api.put(`/compatibility/rules/${ruleId}`, formData);
        if (response.data.success) {
          toast.success('Cập nhật rule thành công');
          navigate('/admin/categories/compatibility');
        }
      } else {
        const response = await api.post('/compatibility/rules', formData);
        if (response.data.success) {
          toast.success('Tạo rule thành công');
          navigate('/admin/categories/compatibility');
        }
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error response errors:', error.response?.data?.errors);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.message || 'Không thể lưu rule');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category?.name || '';
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories/compatibility')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Chỉnh sửa Quy tắc' : 'Tạo Quy tắc Mới'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Cập nhật thông tin quy tắc' : 'Tạo quy tắc kiểm tra tương thích mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Quy Tắc</CardTitle>
            <CardDescription>
              Cấu hình quy tắc kiểm tra tương thích giữa 2 danh mục
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rule Name */}
            <div className="space-y-2">
              <Label htmlFor="rule_name">
                Tên Quy Tắc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rule_name"
                placeholder="VD: CPU-Mainboard Socket Compatibility"
                value={formData.rule_name}
                onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
              />
            </div>

            {/* Categories & Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category 1 (Source) */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-semibold">Danh Mục 1</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="category_1">
                    Danh Mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category_1_id?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_1_id: parseInt(value), attribute_1_id: '' })
                    }
                  >
                    <SelectTrigger id="category_1">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories
                        .filter(cat => cat.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attribute_1">
                    Thuộc tính <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.attribute_1_id?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, attribute_1_id: parseInt(value) })
                    }
                    disabled={!formData.category_1_id}
                  >
                    <SelectTrigger id="attribute_1">
                      <SelectValue placeholder="Chọn thuộc tính" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(attributes1) && attributes1
                        .filter(attr => attr.id)
                        .map((attr) => (
                          <SelectItem key={attr.id} value={attr.id.toString()}>
                            {attr.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category 2 (Target) */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-semibold">Danh Mục 2</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="category_2">
                    Danh Mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category_2_id?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_2_id: parseInt(value), attribute_2_id: '' })
                    }
                  >
                    <SelectTrigger id="category_2">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories
                        .filter(cat => cat.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attribute_2">
                    Thuộc tính <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.attribute_2_id?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, attribute_2_id: parseInt(value) })
                    }
                    disabled={!formData.category_2_id}
                  >
                    <SelectTrigger id="attribute_2">
                      <SelectValue placeholder="Chọn thuộc tính" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(attributes2) && attributes2
                        .filter(attr => attr.id)
                        .map((attr) => (
                          <SelectItem key={attr.id} value={attr.id.toString()}>
                            {attr.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Match Type */}
            <div className="space-y-3">
              <Label>Match Type <span className="text-red-500">*</span></Label>
              <RadioGroup
                value={formData.match_type}
                onValueChange={(value) => setFormData({ ...formData, match_type: value })}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="exact" id="exact" />
                  <div className="space-y-1">
                    <Label htmlFor="exact" className="font-medium cursor-pointer">
                      Exact Match
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      So sánh chính xác (1 → 1), value phải giống nhau hoàn toàn
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="one_to_many" id="one_to_many" />
                  <div className="space-y-1">
                    <Label htmlFor="one_to_many" className="font-medium cursor-pointer">
                      One-to-Many
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Một giá trị có thể map với nhiều giá trị khác (cần mapping table)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="contains" id="contains" />
                  <div className="space-y-1">
                    <Label htmlFor="contains" className="font-medium cursor-pointer">
                      Contains
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Kiểm tra chứa substring (ví dụ: "LGA1700" chứa trong "LGA1700 (12th)")
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
              <Textarea
                id="note"
                placeholder="Thêm mô tả hoặc ghi chú về quy tắc này..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categories/compatibility')}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? 'Cập nhật' : 'Tạo Quy Tắc Mới '}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CompatibilityRuleForm;
