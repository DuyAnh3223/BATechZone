import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductStore } from '@/stores/useProductStore';
import { toast } from 'sonner';
import axios from 'axios';
import AddVariantForm from './AddVariantForm';

/**
 * EditProductPage - Trang sửa sản phẩm độc lập
 * - Nếu có biến thể: 2 tabs (Thông tin SP + Quản lý biến thể)
 * - Nếu không có biến thể: 1 tab (Thông tin SP đầy đủ)
 */
const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    is_featured: 0,
    is_active: 1
  });
  const [variants, setVariants] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [newVariantImages, setNewVariantImages] = useState({});
  const [newVariantImagePreviews, setNewVariantImagePreviews] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddVariantForm, setShowAddVariantForm] = useState(false);

  const { currentProduct, updateProduct, fetchProduct } = useProductStore();

  // Helper function để convert datetime sang YYYY-MM-DD format cho input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (productId) {
      loadProductData();
    }
  }, [productId]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      await fetchProduct(productId);
    } catch (error) {
      toast.error('Không thể tải thông tin sản phẩm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentProduct && currentProduct.product_id === parseInt(productId)) {
      setFormData({
        product_name: currentProduct.product_name || '',
        description: currentProduct.description || '',
        is_featured: currentProduct.is_featured ?? 0,
        is_active: currentProduct.is_active ?? 1
      });
      setVariants(currentProduct.variants || []);

      if (currentProduct.variants && currentProduct.variants.length > 0) {
        currentProduct.variants.forEach(variant => {
          loadVariantImages(variant.variant_id);
        });
      }
    }
  }, [currentProduct, productId]);

  const loadVariantImages = async (variantId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/variant-images/variant/${variantId}`);
      if (response.data.success) {
        setVariantImages(prev => ({
          ...prev,
          [variantId]: response.data.data || []
        }));
      }
    } catch (error) {
      console.error(`Error loading images for variant ${variantId}:`, error);
    }
  };

  const hasVariants = variants.length > 1 || (variants.length === 1 && variants[0].is_default !== 1);
  const defaultVariant = variants.find(v => v.is_default === 1) || variants[0];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const handleSetDefaultVariant = (index) => {
    setVariants(prev => prev.map((variant, i) => ({
      ...variant,
      is_default: i === index ? 1 : 0
    })));
  };

  const handleVariantImagesChange = (variantId, files) => {
    const fileList = Array.from(files);
    if (fileList.length > 10) {
      toast.warning('Tối đa 10 ảnh cho mỗi biến thể');
      return;
    }

    setNewVariantImages(prev => ({
      ...prev,
      [variantId]: fileList
    }));

    const previews = [];
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === fileList.length) {
          setNewVariantImagePreviews(prev => ({
            ...prev,
            [variantId]: previews
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveExistingImage = async (variantId, imageId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/variant-images/images/${imageId}`);
      if (response.data.success) {
        toast.success('Đã xóa ảnh');
        loadVariantImages(variantId);
      }
    } catch (error) {
      toast.error('Không thể xóa ảnh');
      console.error(error);
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      const response = await axios.patch(`http://localhost:5001/api/variant-images/images/${imageId}/set-primary`);
      if (response.data.success) {
        toast.success('Đã đặt làm ảnh chính');
        variants.forEach(variant => {
          loadVariantImages(variant.variant_id);
        });
      }
    } catch (error) {
      toast.error('Không thể đặt ảnh chính');
      console.error(error);
    }
  };

  const handleRemoveNewImage = (variantId, imageIndex) => {
    setNewVariantImages(prev => ({
      ...prev,
      [variantId]: prev[variantId]?.filter((_, i) => i !== imageIndex) || []
    }));
    setNewVariantImagePreviews(prev => ({
      ...prev,
      [variantId]: prev[variantId]?.filter((_, i) => i !== imageIndex) || []
    }));
  };

  const handleAddVariant = () => {
    setShowAddVariantForm(true);
  };

  const handleAddVariantSuccess = async (variantData, images) => {
    try {
      setSaving(true);
      
      const response = await axios.post(`http://localhost:5001/api/variants`, variantData);
      
      if (response.data.success && response.data.data.variant_id) {
        const newVariantId = response.data.data.variant_id;
        
        if (images && images.length > 0) {
          await uploadVariantImages(newVariantId, images);
        }
        
        toast.success('Đã thêm biến thể mới');
        setShowAddVariantForm(false);
        await loadProductData();
      }
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm biến thể');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVariant = async (index) => {
    const variant = variants[index];
    
    if (variant.is_default === 1) {
      toast.error('Không thể xóa biến thể mặc định');
      return;
    }

    if (variant.variant_id && !variant.isNew) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/variants/${variant.variant_id}`);
        if (response.data.success) {
          toast.success('Đã xóa biến thể');
          setVariants(prev => prev.filter((_, i) => i !== index));
        }
      } catch (error) {
        toast.error('Không thể xóa biến thể');
        console.error(error);
      }
    } else {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!formData.product_name) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!hasVariants) {
      if (!defaultVariant?.price || defaultVariant.price <= 0) {
        toast.error('Vui lòng nhập giá sản phẩm');
        return;
      }
      if (defaultVariant.stock_quantity === undefined || defaultVariant.stock_quantity < 0) {
        toast.error('Vui lòng nhập số lượng tồn kho');
        return;
      }
    } else {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant.price || variant.price <= 0) {
          toast.error(`Biến thể "${variant.variant_name}" chưa có giá`);
          return;
        }
        if (variant.stock_quantity === undefined || variant.stock_quantity < 0) {
          toast.error(`Biến thể "${variant.variant_name}" chưa có số lượng tồn kho`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      
      submitData.append('product_name', formData.product_name);
      submitData.append('description', formData.description || '');
      submitData.append('is_featured', formData.is_featured);
      submitData.append('is_active', formData.is_active);

      if (!hasVariants) {
        submitData.append('base_price', defaultVariant.price);
        submitData.append('warranty_period', defaultVariant.warranty_period || 0);
        submitData.append('stock_quantity', defaultVariant.stock_quantity || 0);
        
        // Thêm discount fields cho default variant
        if (defaultVariant.discount_percent) {
          submitData.append('discount_percent', parseFloat(defaultVariant.discount_percent));
        }
        if (defaultVariant.discount_start_date) {
          submitData.append('discount_start_date', defaultVariant.discount_start_date);
        }
        if (defaultVariant.discount_end_date) {
          submitData.append('discount_end_date', defaultVariant.discount_end_date);
        }
      }

      await updateProduct(productId, submitData);

      if (hasVariants) {
        for (const variant of variants) {
          const variantData = {
            variant_name: variant.variant_name,
            sku: variant.sku || '',
            price: parseFloat(variant.price),
            stock_quantity: parseInt(variant.stock_quantity),
            warranty_period: parseInt(variant.warranty_period || 0),
            discount_percent: variant.discount_percent ? parseFloat(variant.discount_percent) : null,
            discount_start_date: variant.discount_start_date || null,
            discount_end_date: variant.discount_end_date || null,
            is_default: variant.is_default,
            is_active: variant.is_active
          };

          if (variant.isNew) {
            const response = await axios.post(`http://localhost:5001/api/variants`, {
              product_id: productId,
              ...variantData
            });
            
            if (response.data.success && response.data.data.variant_id) {
              const newVariantId = response.data.data.variant_id;
              
              if (newVariantImages[variant.variant_id]?.length > 0) {
                await uploadVariantImages(newVariantId, newVariantImages[variant.variant_id]);
              }
            }
          } else {
            await axios.put(`http://localhost:5001/api/variants/${variant.variant_id}`, variantData);
            
            if (newVariantImages[variant.variant_id]?.length > 0) {
              await uploadVariantImages(variant.variant_id, newVariantImages[variant.variant_id]);
            }
          }
        }
      } else {
        if (defaultVariant?.variant_id && newVariantImages[defaultVariant.variant_id]?.length > 0) {
          await uploadVariantImages(defaultVariant.variant_id, newVariantImages[defaultVariant.variant_id]);
        }
      }

      toast.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const uploadVariantImages = async (variantId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await axios.post(
        `http://localhost:5001/api/variant-images/variants/${variantId}/images/bulk`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      console.error(`Error uploading images for variant ${variantId}:`, error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      {/* Add Variant Form Modal */}
      {showAddVariantForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
            <AddVariantForm
              productId={productId}
              categoryId={currentProduct?.category_id}
              existingVariants={variants}
              onClose={() => setShowAddVariantForm(false)}
              onSuccess={handleAddVariantSuccess}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => navigate('/admin/products')} 
                  variant="ghost"
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Sửa Sản Phẩm
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentProduct?.product_name || ''}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {hasVariants ? (
              <>
                <TabsList className="bg-white p-1 shadow-sm">
                  <TabsTrigger value="info" className="data-[state=active]:bg-blue-50">
                    Thông Tin Sản Phẩm
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="data-[state=active]:bg-blue-50">
                    Quản Lý Biến Thể
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Product Info */}
                <TabsContent value="info">
                  <div className="border-2 border-gray-100 rounded-xl p-8 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-blue-100">
                      <div className="w-1 h-6 bg-blue-600 rounded"></div>
                      <h3 className="text-lg font-bold text-gray-800">Thông Tin Cơ Bản</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="product_name" className="text-sm font-semibold text-gray-700">Tên Sản Phẩm *</Label>
                        <Input
                          id="product_name"
                          value={formData.product_name}
                          onChange={(e) => handleChange('product_name', e.target.value)}
                          placeholder="Nhập tên sản phẩm"
                          className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Mô Tả</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          placeholder="Mô tả chi tiết về sản phẩm..."
                          rows={8}
                          className="mt-2 border-gray-300 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-8 pt-2 px-4 py-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="is_featured"
                            checked={formData.is_featured === 1}
                            onCheckedChange={(checked) => handleChange('is_featured', checked ? 1 : 0)}
                            className="w-5 h-5"
                          />
                          <Label htmlFor="is_featured" className="cursor-pointer text-sm font-medium">🌟 Sản Phẩm Nổi Bật</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="is_active"
                            checked={formData.is_active === 1}
                            onCheckedChange={(checked) => handleChange('is_active', checked ? 1 : 0)}
                            className="w-5 h-5"
                          />
                          <Label htmlFor="is_active" className="cursor-pointer text-sm font-medium">✓ Đang Kích Hoạt</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Variant Management */}
                <TabsContent value="variants">
                  <div className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-600 rounded"></div>
                        <h3 className="text-lg font-bold text-gray-800">Danh Sách Biến Thể</h3>
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {variants.length} biến thể
                        </span>
                      </div>
                      <Button 
                        onClick={handleAddVariant} 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 shadow-md"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Biến Thể
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                      {variants.map((variant, index) => (
                        <div key={variant.variant_id || index} className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                #{index + 1}
                              </span>
                              {variant.is_default === 1 && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                                  ⭐ Mặc định
                                </span>
                              )}
                            </div>
                            {variant.is_default !== 1 && (
                              <Button
                                onClick={() => handleDeleteVariant(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Xóa
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="md:col-span-2">
                              <Label className="text-xs font-semibold text-gray-700">Tên Biến Thể *</Label>
                              <Input
                                value={variant.variant_name}
                                onChange={(e) => handleUpdateVariant(index, 'variant_name', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                                placeholder="VD: RAM 8GB, Màu Đỏ..."
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">Giá (VNĐ) *</Label>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleUpdateVariant(index, 'price', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">Tồn Kho *</Label>
                              <Input
                                type="number"
                                value={variant.stock_quantity}
                                onChange={(e) => handleUpdateVariant(index, 'stock_quantity', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">Bảo Hành (tháng)</Label>
                              <Input
                                type="number"
                                value={variant.warranty_period || 0}
                                onChange={(e) => handleUpdateVariant(index, 'warranty_period', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">Khuyến Mãi (%)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={variant.discount_percent || ''}
                                onChange={(e) => handleUpdateVariant(index, 'discount_percent', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">KM Từ Ngày</Label>
                              <Input
                                type="date"
                                value={formatDateForInput(variant.discount_start_date)}
                                onChange={(e) => handleUpdateVariant(index, 'discount_start_date', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700">KM Đến Ngày</Label>
                              <Input
                                type="date"
                                value={formatDateForInput(variant.discount_end_date)}
                                onChange={(e) => handleUpdateVariant(index, 'discount_end_date', e.target.value)}
                                className="mt-1.5 h-10 border-gray-300"
                              />
                            </div>

                            <div className="flex items-center gap-6 md:col-span-2 px-3 py-2 bg-white rounded-lg border">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`default-${index}`}
                                  checked={variant.is_default === 1}
                                  onCheckedChange={() => handleSetDefaultVariant(index)}
                                  className="w-4 h-4"
                                />
                                <Label htmlFor={`default-${index}`} className="text-xs cursor-pointer font-medium">
                                  Đặt làm mặc định
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`active-${index}`}
                                  checked={variant.is_active === 1}
                                  onCheckedChange={(checked) => handleUpdateVariant(index, 'is_active', checked ? 1 : 0)}
                                  className="w-4 h-4"
                                />
                                <Label htmlFor={`active-${index}`} className="text-xs cursor-pointer font-medium">
                                  Kích hoạt
                                </Label>
                              </div>
                            </div>
                          </div>

                          {/* Variant Images */}
                          <div className="mt-5 pt-5 border-t-2 border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <ImageIcon className="w-4 h-4 text-blue-600" />
                              <Label className="text-sm font-semibold text-gray-700">Quản Lý Hình Ảnh</Label>
                            </div>
                            
                            {variantImages[variant.variant_id] && variantImages[variant.variant_id].length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-2.5">
                                  📷 Ảnh hiện tại ({variantImages[variant.variant_id].length})
                                </p>
                                <div className="grid grid-cols-6 gap-3">
                                  {variantImages[variant.variant_id].map((img) => (
                                    <div key={img.image_id} className="relative group">
                                      <img 
                                        src={img.image_url.startsWith('http') ? img.image_url : `http://localhost:5001${img.image_url}`}
                                        alt={img.alt_text}
                                        className="w-full h-20 object-cover rounded border-2 border-gray-200"
                                      />
                                      {img.is_primary === 1 && (
                                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                          Primary
                                        </span>
                                      )}
                                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                        {img.is_primary !== 1 && (
                                          <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => handleSetPrimaryImage(img.image_id)}
                                            className="bg-blue-500 text-white h-6 w-6 p-0"
                                            title="Đặt làm ảnh chính"
                                          >
                                            <ImageIcon className="h-3 w-3" />
                                          </Button>
                                        )}
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => handleRemoveExistingImage(variant.variant_id, img.image_id)}
                                          className="bg-red-500 text-white h-6 w-6 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleVariantImagesChange(variant.variant_id || `new-${index}`, e.target.files)}
                              className="mt-2"
                            />

                            {newVariantImagePreviews[variant.variant_id || `new-${index}`] && 
                             newVariantImagePreviews[variant.variant_id || `new-${index}`].length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs font-medium text-green-700 mb-2.5">
                                  🆕 Ảnh mới - chưa lưu ({newVariantImagePreviews[variant.variant_id || `new-${index}`].length})
                                </p>
                                <div className="grid grid-cols-6 gap-3">
                                  {newVariantImagePreviews[variant.variant_id || `new-${index}`].map((preview, imgIdx) => (
                                    <div key={imgIdx} className="relative group">
                                      <img 
                                        src={preview}
                                        alt={`New ${imgIdx + 1}`}
                                        className="w-full h-20 object-cover rounded border-2 border-green-200"
                                      />
                                      {imgIdx === 0 && (
                                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                          Primary
                                        </span>
                                      )}
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRemoveNewImage(variant.variant_id || `new-${index}`, imgIdx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsList className="bg-white p-1 shadow-sm">
                  <TabsTrigger value="info" className="data-[state=active]:bg-blue-50">
                    Thông Tin Sản Phẩm
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <div className="border-2 border-gray-100 rounded-xl p-8 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-blue-100">
                      <div className="w-1 h-6 bg-blue-600 rounded"></div>
                      <h3 className="text-lg font-bold text-gray-800">Thông Tin Sản Phẩm</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="product_name" className="text-sm font-semibold text-gray-700">Tên Sản Phẩm *</Label>
                          <Input
                            id="product_name"
                            value={formData.product_name}
                            onChange={(e) => handleChange('product_name', e.target.value)}
                            placeholder="Nhập tên sản phẩm"
                            className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Giá (VNĐ) *</Label>
                            <Input
                              id="price"
                              type="number"
                              value={defaultVariant?.price || ''}
                              onChange={(e) => handleUpdateVariant(0, 'price', e.target.value)}
                              placeholder="0"
                              className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">Tồn Kho *</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={defaultVariant?.stock_quantity || 0}
                              onChange={(e) => handleUpdateVariant(0, 'stock_quantity', e.target.value)}
                              placeholder="0"
                              className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="warranty" className="text-sm font-semibold text-gray-700">Bảo Hành (tháng)</Label>
                          <Input
                            id="warranty"
                            type="number"
                            value={defaultVariant?.warranty_period || 0}
                            onChange={(e) => handleUpdateVariant(0, 'warranty_period', e.target.value)}
                            placeholder="0"
                            className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="discount_percent" className="text-sm font-semibold text-gray-700">Khuyến Mãi (%)</Label>
                          <Input
                            id="discount_percent"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={defaultVariant?.discount_percent || ''}
                            onChange={(e) => handleUpdateVariant(0, 'discount_percent', e.target.value)}
                            placeholder="0"
                            className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="discount_start" className="text-sm font-semibold text-gray-700">KM Từ Ngày</Label>
                            <Input
                              id="discount_start"
                              type="date"
                              value={formatDateForInput(defaultVariant?.discount_start_date)}
                              onChange={(e) => handleUpdateVariant(0, 'discount_start_date', e.target.value)}
                              className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="discount_end" className="text-sm font-semibold text-gray-700">KM Đến Ngày</Label>
                            <Input
                              id="discount_end"
                              type="date"
                              value={formatDateForInput(defaultVariant?.discount_end_date)}
                              onChange={(e) => handleUpdateVariant(0, 'discount_end_date', e.target.value)}
                              className="mt-2 h-12 border-gray-300 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description_no_var" className="text-sm font-semibold text-gray-700">Mô Tả</Label>
                          <Textarea
                            id="description_no_var"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Mô tả chi tiết về sản phẩm..."
                            rows={6}
                            className="mt-2 border-gray-300 focus:border-blue-500 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-8 pt-2 px-4 py-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="is_featured_no_var"
                              checked={formData.is_featured === 1}
                              onCheckedChange={(checked) => handleChange('is_featured', checked ? 1 : 0)}
                              className="w-5 h-5"
                            />
                            <Label htmlFor="is_featured_no_var" className="cursor-pointer text-sm font-medium">
                              🌟 Sản Phẩm Nổi Bật
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="is_active_no_var"
                              checked={formData.is_active === 1}
                              onCheckedChange={(checked) => handleChange('is_active', checked ? 1 : 0)}
                              className="w-5 h-5"
                            />
                            <Label htmlFor="is_active_no_var" className="cursor-pointer text-sm font-medium">
                              ✓ Đang Kích Hoạt
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {defaultVariant && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <ImageIcon className="w-5 h-5 text-blue-600" />
                              <Label className="text-sm font-semibold text-gray-700">Quản lý Hình Ảnh</Label>
                              <span className="text-xs text-gray-500">(tối đa 10 ảnh)</span>
                            </div>
                            
                            {variantImages[defaultVariant.variant_id] && variantImages[defaultVariant.variant_id].length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-2.5">
                                  📷 Ảnh hiện tại ({variantImages[defaultVariant.variant_id].length})
                                </p>
                                <div className="grid grid-cols-5 gap-3">
                                  {variantImages[defaultVariant.variant_id].map((img) => (
                                    <div key={img.image_id} className="relative group">
                                      <img 
                                        src={img.image_url.startsWith('http') ? img.image_url : `http://localhost:5001${img.image_url}`}
                                        alt={img.alt_text}
                                        className="w-full h-20 object-cover rounded border-2 border-gray-200"
                                      />
                                      {img.is_primary === 1 && (
                                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                          Primary
                                        </span>
                                      )}
                                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                        {img.is_primary !== 1 && (
                                          <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => handleSetPrimaryImage(img.image_id)}
                                            className="bg-blue-500 text-white h-6 w-6 p-0"
                                            title="Đặt làm ảnh chính"
                                          >
                                            <ImageIcon className="h-3 w-3" />
                                          </Button>
                                        )}
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => handleRemoveExistingImage(defaultVariant.variant_id, img.image_id)}
                                          className="bg-red-500 text-white h-6 w-6 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleVariantImagesChange(defaultVariant.variant_id, e.target.files)}
                              className="h-11"
                            />

                            {newVariantImagePreviews[defaultVariant.variant_id] && 
                             newVariantImagePreviews[defaultVariant.variant_id].length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-green-700 mb-2.5">
                                  🆕 Ảnh mới - chưa lưu ({newVariantImagePreviews[defaultVariant.variant_id].length})
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                  {newVariantImagePreviews[defaultVariant.variant_id].map((preview, idx) => (
                                    <div key={idx} className="relative group">
                                      <img 
                                        src={preview}
                                        alt={`New ${idx + 1}`}
                                        className="w-full h-20 object-cover rounded border-2 border-green-200"
                                      />
                                      {idx === 0 && (
                                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                          Primary
                                        </span>
                                      )}
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRemoveNewImage(defaultVariant.variant_id, idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default EditProductPage;
