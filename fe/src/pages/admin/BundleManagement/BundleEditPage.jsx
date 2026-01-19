import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload, Loader2, Plus, Minus, Trash2, Search, Filter, Info, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useAdminBundleStore } from '@/stores/useBundleStore';
import { productService } from '@/services/productService';
import { compatibilityService } from '@/services/compatibilityService';
import { variantService } from '@/services/variantService';

const COMPONENT_TYPES = [
  { id: "cpu", name: "Bộ vi xử lý (CPU)", categoryId: 1, required: true },
  { id: "mainboard", name: "Bo mạch chủ", categoryId: 5, required: true },
  { id: "ram", name: "RAM", categoryId: 35, required: true },
  { id: "hdd", name: "Ổ cứng HDD", categoryId: 13, required: false },
  { id: "ssd", name: "Ổ cứng SSD", categoryId: 4, required: true },
  { id: "vga", name: "Card đồ họa (VGA)", categoryId: 2, required: false },
  { id: "psu", name: "Nguồn máy tính", categoryId: 6, required: true },
  { id: "case", name: "Vỏ Case", categoryId: 7, required: true }
];

const CATEGORY_MAP = {
  cpu: 1,
  mainboard: 5,
  ram: 35,
  hdd: 13,
  ssd: 4,
  vga: 2,
  psu: 6,
  case: 7
};

const getCategoryComponentType = (categoryId) => {
  const entry = Object.entries(CATEGORY_MAP).find(([_, id]) => id === categoryId);
  return entry ? entry[0] : null;
};

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);

const BundleEditPage = () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();
  const [activeTab, setActiveTab] = useState('basic');
  const [loadingBundle, setLoadingBundle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    bundle_name: '',
    category_id: 1,
    description: '',
    price: '',
    warranty_period: 24,
    is_active: true,
    is_featured: false,
    discount_percent: 0,
    discount_start_date: '',
    discount_end_date: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [quantities, setQuantities] = useState({});
  const [compatibilityTracking, setCompatibilityTracking] = useState({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    case: null,
  });

  const [pickerState, setPickerState] = useState({
    open: false,
    type: null,
    search: "",
    sort: "default",
  });

  const [productCatalog, setProductCatalog] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState(null);
  const [brandFilters, setBrandFilters] = useState([]);
  const [attributeFilters, setAttributeFilters] = useState({});
  const [compatibilityFiltersData, setCompatibilityFiltersData] = useState(null);

  const { categories, fetchCategories } = useCategoryStore();
  const { fetchAdminBundleDetail, updateBundle, deleteBundle } = useAdminBundleStore();

  const pageSize = 6;

  useEffect(() => {
    fetchCategories();
    loadBundleData();
  }, [fetchCategories, bundleId]);

  const loadBundleData = async () => {
    try {
      setLoadingBundle(true);
      const response = await fetchAdminBundleDetail(bundleId);
      const bundle = response.data;

      setFormData({
        bundle_name: bundle.variant_name || bundle.product_name,
        category_id: bundle.category_id || 1,
        description: bundle.description || '',
        price: bundle.price,
        warranty_period: bundle.warranty_period,
        is_active: bundle.is_active === 1,
        is_featured: bundle.is_featured === 1 || false,
        discount_percent: bundle.discount_percent || 0,
        discount_start_date: bundle.discount_start_date?.split('T')[0] || '',
        discount_end_date: bundle.discount_end_date?.split('T')[0] || ''
      });

      // Load bundle variant images
      try {
        console.log('Loading images for bundle variant:', bundleId);
        console.log('Bundle img_path:', bundle.img_path);
        const variantImages = await variantService.getVariantImages(bundleId);
        console.log('Variant images response:', variantImages);
        const images = variantImages?.data || variantImages || [];
        console.log('Images array:', images);
        const primaryImage = images.find(img => img.is_primary) || images[0];
        console.log('Primary image:', primaryImage);
        
        if (primaryImage?.image_url) {
          const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${primaryImage.image_url}`;
          console.log('Setting bundle image URL:', imageUrl);
          setCurrentImagePath(imageUrl);
          setImagePreview(imageUrl);
        } else if (bundle.img_path) {
          // Fallback to product image if no variant images
          console.log('No variant images, using product image:', bundle.img_path);
          const imageUrl = bundle.img_path.startsWith('http') 
            ? bundle.img_path 
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${bundle.img_path}`;
          console.log('Product image URL:', imageUrl);
          setCurrentImagePath(imageUrl);
          setImagePreview(imageUrl);
        } else {
          console.log('No images found for bundle - will show upload button only');
        }
      } catch (error) {
        console.error('Error loading bundle image:', error);
        // Fallback to product image on error
        if (bundle.img_path) {
          const imageUrl = bundle.img_path.startsWith('http')
            ? bundle.img_path
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${bundle.img_path}`;
          setCurrentImagePath(imageUrl);
          setImagePreview(imageUrl);
        }
      }

      if (bundle.components) {
        const componentsObj = {};
        const quantitiesObj = {};
        const trackingObj = { cpu: null, mainboard: null, ram: null, vga: null, case: null };

        for (const comp of bundle.components) {
          const type = getCategoryComponentType(comp.category_id);
          if (type) {
            let imageUrl = comp.img_path 
              ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${comp.img_path}`
              : '/placeholder.png';
            
            // Load variant images
            try {
              const variantImages = await variantService.getVariantImages(comp.component_variant_id);
              const images = variantImages?.data || variantImages || [];
              const primaryImage = images.find(img => img.is_primary) || images[0];
              
              if (primaryImage?.image_url) {
                imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${primaryImage.image_url}`;
              }
            } catch (error) {
              console.error(`Error loading image for variant ${comp.component_variant_id}:`, error);
            }

            componentsObj[type] = {
              variant_id: comp.component_variant_id,
              variant_name: comp.variant_name,
              product_name: comp.product_name,
              price: parseFloat(comp.price) || 0,
              stock: comp.component_stock || 0,
              img_path: imageUrl
            };
            quantitiesObj[type] = comp.quantity;

            if (['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(type)) {
              trackingObj[type] = comp.component_variant_id;
            }
          }
        }

        setSelectedComponents(componentsObj);
        setQuantities(quantitiesObj);
        setCompatibilityTracking(trackingObj);
      }
    } catch (error) {
      console.error('Error loading bundle:', error);
      toast.error('Không thể tải thông tin bundle');
    } finally {
      setLoadingBundle(false);
    }
  };

  const totalComponentPrice = useMemo(() => {
    return Object.entries(selectedComponents).reduce(
      (sum, [type, component]) =>
        sum + (component?.price || 0) * (quantities[type] || 1),
      0
    );
  }, [selectedComponents, quantities]);

  const availableStock = useMemo(() => {
    const stocks = Object.entries(selectedComponents).map(([type, component]) => {
      const qty = quantities[type] || 1;
      const componentStock = component?.stock || 0;
      return Math.floor(componentStock / qty);
    });

    return stocks.length > 0 ? Math.min(...stocks) : 0;
  }, [selectedComponents, quantities]);

  const savings = useMemo(() => {
    const bundlePrice = parseFloat(formData.price) || 0;
    return Math.max(0, totalComponentPrice - bundlePrice);
  }, [totalComponentPrice, formData.price]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchCompatibilityFilters = useCallback(async (typeId) => {
    if (!['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(typeId)) {
      setCompatibilityFiltersData(null);
      return;
    }

    try {
      const response = await compatibilityService.getCompatibilityFilters(
        typeId,
        compatibilityTracking
      );
      
      if (response.success && response.data) {
        setCompatibilityFiltersData(response.data);
        
        if (response.data.filters && response.data.filters.length > 0) {
          const autoFilters = {};
          
          response.data.filters.forEach(filter => {
            const { attributeId, compatibleValues } = filter;
            const valueIds = compatibleValues.map(cv => cv.attribute_value_id);
            
            if (valueIds.length > 0) {
              autoFilters[attributeId] = valueIds;
            }
          });
          
          if (Object.keys(autoFilters).length > 0) {
            setAttributeFilters(autoFilters);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching compatibility filters for ${typeId}:`, error);
      setCompatibilityFiltersData(null);
    }
  }, [compatibilityTracking]);

  const fetchFilterOptions = useCallback(async (typeId) => {
    try {
      const categoryId = CATEGORY_MAP[typeId];
      const response = await productService.getFilterOptions(categoryId);
      
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setFilterOptions(null);
    }
  }, []);

  const fetchProductsForType = useCallback(async (typeId) => {
    if (productCatalog[typeId]?.length > 0) return;

    try {
      setLoading(true);
      const categoryId = CATEGORY_MAP[typeId];
      const response = await productService.getProductsWithAttributes({ 
        category_id: categoryId, 
        is_active: 1 
      });

      if (response.success && response.data) {
        const transformedProducts = [];
        
        for (const product of response.data) {
          if (product.variants?.length > 0) {
            for (const variant of product.variants) {
              const attributesArray = variant.attribute_values?.length > 0 
                ? variant.attribute_values 
                : product.attributes || [];
              
              const attrs = {};
              attributesArray.forEach(attr => {
                attrs[attr.attribute_name] = attr.value_name;
              });
              
              const brand = attrs['Hãng'] || attrs['Nhà sản xuất'] || attrs['Thương hiệu'] || 'N/A';
              
              let imageUrl = product.img_path 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${product.img_path}`
                : '/placeholder.png';
              
              try {
                const variantImages = await variantService.getVariantImages(variant.variant_id);
                const images = variantImages?.data || variantImages || [];
                const primaryImage = images.find(img => img.is_primary) || images[0];
                
                if (primaryImage?.image_url) {
                  imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${primaryImage.image_url}`;
                }
              } catch (error) {
                console.error(`Error loading image for variant ${variant.variant_id}:`, error);
              }
              
              transformedProducts.push({
                product_id: product.product_id,
                variant_id: variant.variant_id,
                product_name: product.product_name,
                variant_name: variant.variant_name,
                sku: variant.sku,
                price: parseFloat(variant.price) || 0,
                stock: variant.stock_quantity || 0,
                img_path: imageUrl,
                brand,
                attributes: attrs,
                attributesRaw: attributesArray,
              });
            }
          }
        }

        setProductCatalog(prev => ({
          ...prev,
          [typeId]: transformedProducts
        }));
      }
    } catch (error) {
      console.error(`Error fetching products for ${typeId}:`, error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProductCatalog(prev => ({ ...prev, [typeId]: [] }));
    } finally {
      setLoading(false);
    }
  }, [productCatalog]);

  const openPicker = async (type) => {
    setPickerState({
      open: true,
      type,
      search: "",
      sort: "default",
    });
    setCurrentPage(1);
    setBrandFilters([]);
    setAttributeFilters({});
    setCompatibilityFiltersData(null);

    await Promise.all([
      fetchProductsForType(type),
      fetchFilterOptions(type),
      fetchCompatibilityFilters(type)
    ]);
  };

  const closePicker = () => {
    setPickerState({
      open: false,
      type: null,
      search: "",
      sort: "default",
    });
    setCurrentPage(1);
    setBrandFilters([]);
    setAttributeFilters({});
  };

  const handleAddComponent = (component) => {
    const type = pickerState.type;
    
    setSelectedComponents(prev => ({
      ...prev,
      [type]: component
    }));

    if (!quantities[type]) {
      setQuantities(prev => ({
        ...prev,
        [type]: 1
      }));
    }

    if (['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(type)) {
      setCompatibilityTracking(prev => ({
        ...prev,
        [type]: component.variant_id
      }));
    }

    toast.success(`Đã thêm ${component.variant_name || component.product_name}`);
    closePicker();
  };

  const handleRemoveComponent = (type) => {
    const newSelected = { ...selectedComponents };
    const newQuantities = { ...quantities };
    
    delete newSelected[type];
    delete newQuantities[type];
    
    setSelectedComponents(newSelected);
    setQuantities(newQuantities);

    if (['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(type)) {
      setCompatibilityTracking(prev => ({
        ...prev,
        [type]: null
      }));
    }

    toast.info('Đã xóa linh kiện');
  };

  const handleQuantityChange = (type, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [type]: qty
    }));
  };

  const getFilteredProducts = () => {
    const type = pickerState.type;
    if (!type || !productCatalog[type]) return [];

    let products = [...productCatalog[type]];

    if (pickerState.search) {
      const search = pickerState.search.toLowerCase();
      products = products.filter(p => 
        p.product_name?.toLowerCase().includes(search) ||
        p.variant_name?.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search)
      );
    }

    if (brandFilters.length > 0) {
      products = products.filter(p => brandFilters.includes(p.brand));
    }

    if (Object.keys(attributeFilters).length > 0) {
      products = products.filter((item) => {
        const itemAttributes = item.attributesRaw || [];
        
        if (itemAttributes.length === 0) {
          return false;
        }
        
        const matchesAllFilters = Object.entries(attributeFilters).every(([attributeId, selectedValueIds]) => {
          return selectedValueIds.some(selectedValueId => {
            return itemAttributes.some(attr => {
              const attrId = attr.attribute_id;
              const attrValueId = attr.attribute_value_id;
              const attributeMatches = String(attrId) === String(attributeId);
              const valueMatches = String(attrValueId) === String(selectedValueId);
              return attributeMatches && valueMatches;
            });
          });
        });
        
        return matchesAllFilters;
      });
    }

    if (pickerState.sort === 'asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (pickerState.sort === 'desc') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async () => {
    let bundleData = null; // Declare outside try block
    try {
      if (!formData.bundle_name.trim()) {
        toast.error('Vui lòng nhập tên bundle');
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Vui lòng nhập giá bán hợp lệ');
        return;
      }

      const validComponents = Object.entries(selectedComponents).filter(([_, c]) => c.variant_id);
      if (validComponents.length === 0) {
        toast.error('Vui lòng thêm ít nhất một linh kiện');
        return;
      }

      setLoading(true);

      bundleData = {
        bundle_name: formData.bundle_name.trim(),
        category_id: formData.category_id,
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price),
        warranty_period: parseInt(formData.warranty_period) || 24,
        is_active: formData.is_active ? 1 : 0,
        is_featured: formData.is_featured ? 1 : 0,
        discount_percent: parseFloat(formData.discount_percent) || 0,
        discount_start_date: (formData.discount_start_date && formData.discount_start_date.trim() !== '') ? formData.discount_start_date.trim() : null,
        discount_end_date: (formData.discount_end_date && formData.discount_end_date.trim() !== '') ? formData.discount_end_date.trim() : null,
        components: validComponents.map(([type, component], idx) => ({
          component_variant_id: component.variant_id,
          quantity: quantities[type] || 1,
          display_order: idx + 1
        }))
      };

      console.log('Bundle data to send:', JSON.stringify(bundleData, null, 2));

      // Update bundle first
      await updateBundle(bundleId, bundleData);

      // Upload image to variant if imageFile exists
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append('images', imageFile);
        
        try {
          await variantService.uploadVariantImages(bundleId, formDataImg);
          console.log('Image uploaded successfully for variant:', bundleId);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.warning('Bundle đã cập nhật nhưng không thể upload ảnh');
        }
      }
      
      toast.success('Cập nhật bundle thành công!');
      navigate('/admin/bundles');
    } catch (error) {
      console.error('Error updating bundle:', error);
      console.error('Error response:', error.response?.data);
      if (bundleData) {
        console.error('Bundle data sent:', JSON.stringify(bundleData, null, 2));
      }
      toast.error(error.response?.data?.message || 'Không thể cập nhật bundle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteBundle(bundleId);
      
      toast.success('Đã xóa bundle thành công!');
      setDeleteConfirm(false);
      navigate('/admin/bundles');
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa bundle');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải thông tin bundle...</p>
        </div>
      </div>
    );
  }

  const renderBasicInfo = () => (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Label htmlFor="bundle_name">Tên Bundle *</Label>
        <Input
          id="bundle_name"
          value={formData.bundle_name}
          onChange={(e) => handleChange('bundle_name', e.target.value)}
          placeholder="VD: PC Gaming RTX 4060 - Core i5 14400F"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">Danh mục</Label>
          <Select
            value={formData.category_id.toString()}
            onValueChange={(val) => handleChange('category_id', parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories?.filter(cat => cat?.id).map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              )) || []}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty_period">Bảo hành (tháng)</Label>
          <Input
            id="warranty_period"
            type="number"
            value={formData.warranty_period}
            onChange={(e) => handleChange('warranty_period', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          placeholder="Mô tả chi tiết về bundle..."
        />
      </div>

      <div className="space-y-2">
        <Label>Hình ảnh</Label>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <label htmlFor="image" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {imagePreview ? 'Thay đổi ảnh' : 'Upload Ảnh'}
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </Button>
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
              {imageFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(currentImagePath || null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Kích hoạt</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => handleChange('is_featured', checked)}
          />
          <Label htmlFor="is_featured">Nổi bật</Label>
        </div>
      </div>
    </div>
  );

  const renderComponentsTab = () => (
    <div className="space-y-4 p-6">
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          Bạn có thể thêm/xóa/thay đổi linh kiện trong bundle. Lưu ý: việc này không tạo thêm serial mới.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        {COMPONENT_TYPES.map(componentType => {
          const selected = selectedComponents[componentType.id];
          const qty = quantities[componentType.id] || 1;

          return (
            <Card key={componentType.id} className={componentType.required && !selected ? 'border-red-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {selected && (
                    <div className="w-20 h-20 flex-shrink-0 mr-4">
                      <img
                        src={selected.img_path || '/placeholder.png'}
                        alt={selected.product_name}
                        className="w-full h-full object-contain rounded border"
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{componentType.name}</h3>
                      {componentType.required && (
                        <Badge variant="destructive">Bắt buộc</Badge>
                      )}
                    </div>
                    
                    {selected ? (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          {selected.product_name}
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          {formatPrice(selected.price)} × {qty} = {formatPrice(selected.price * qty)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tồn kho: {selected.stock || 0}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Chưa chọn linh kiện</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selected && (
                      <>
                        <div className="flex items-center gap-1 border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(componentType.id, qty - 1)}
                            disabled={qty <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={qty}
                            onChange={(e) => handleQuantityChange(componentType.id, e.target.value)}
                            className="w-16 text-center border-0"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(componentType.id, qty + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveComponent(componentType.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant={selected ? "outline" : "default"}
                      onClick={() => openPicker(componentType.id)}
                    >
                      {selected ? 'Thay đổi' : 'Chọn'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(selectedComponents).length > 0 && (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">📊 Thông tin tổng hợp:</div>
            <div>• Tổng giá gốc từ linh kiện: <strong>{formatPrice(totalComponentPrice)}</strong></div>
            <div>• Tồn kho khả dụng: <strong>{availableStock} bộ</strong></div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-4 p-6">
      <Alert>
        <AlertDescription>
          <strong>Tổng giá gốc từ linh kiện:</strong> {formatPrice(totalComponentPrice)}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="price">Giá bán Bundle *</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="0"
        />
      </div>

      {savings > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>
            <div className="font-semibold text-lg text-green-700">
              💰 Tiết kiệm: {formatPrice(savings)}
            </div>
            <div className="text-sm text-green-600">
              Khách hàng sẽ tiết kiệm được {((savings / totalComponentPrice) * 100).toFixed(1)}% khi mua bundle
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-4">Giảm giá (Tùy chọn)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount_percent">% Giảm giá</Label>
            <Input
              id="discount_percent"
              type="number"
              min="0"
              max="100"
              value={formData.discount_percent}
              onChange={(e) => handleChange('discount_percent', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_start">Ngày bắt đầu</Label>
            <Input
              id="discount_start"
              type="date"
              value={formData.discount_start_date}
              onChange={(e) => handleChange('discount_start_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_end">Ngày kết thúc</Label>
            <Input
              id="discount_end"
              type="date"
              value={formData.discount_end_date}
              onChange={(e) => handleChange('discount_end_date', e.target.value)}
            />
          </div>
        </div>

        {formData.discount_percent > 0 && formData.price && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <strong>Giá sau giảm:</strong> {formatPrice(formData.price * (1 - formData.discount_percent / 100))}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  const renderComponentPicker = () => (
    <Dialog open={pickerState.open} onOpenChange={closePicker}>
      <DialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90vw] !h-[90vh] !max-w-none !p-0 !gap-0 !border-0 !rounded-lg !overflow-hidden !grid !grid-cols-1">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            Chọn {COMPONENT_TYPES.find(ct => ct.id === pickerState.type)?.name}
          </DialogTitle>
          <DialogDescription>
            Chọn sản phẩm phù hợp cho bundle của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar - Filters */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto p-4 space-y-4">
            <div className="font-semibold text-lg mb-4">Bộ lọc</div>
            
            {filterOptions ? (
              <>
                {/* Brand Filter */}
                {filterOptions.brands && filterOptions.brands.length > 0 && (
                  <div className="pb-4 border-b">
                    <h4 className="font-medium mb-3">Thương hiệu</h4>
                    <div className="space-y-2">
                      {filterOptions.brands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={brandFilters.includes(brand) || false}
                            onChange={() => {
                              setBrandFilters(prev =>
                                prev.includes(brand)
                                  ? prev.filter(b => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attribute Filters */}
                {filterOptions.attributes?.map(attr => (
                  <div key={attr.attribute_id} className="pb-4 border-b">
                    <h4 className="font-medium mb-3">{attr.attribute_name}</h4>
                    <div className="space-y-2">
                      {attr.values.map(val => {
                        const isSelected = attributeFilters[attr.attribute_id]?.includes(val.attribute_value_id);
                        return (
                          <label key={val.attribute_value_id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={() => {
                                setAttributeFilters(prev => {
                                  const current = prev[attr.attribute_id] || [];
                                  const newValues = current.includes(val.attribute_value_id)
                                    ? current.filter(id => id !== val.attribute_value_id)
                                    : [...current, val.attribute_value_id];
                                  
                                  if (newValues.length === 0) {
                                    const { [attr.attribute_id]: _, ...rest } = prev;
                                    return rest;
                                  }
                                  return { ...prev, [attr.attribute_id]: newValues };
                                });
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{val.value_name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-sm text-gray-500">Không có bộ lọc</div>
            )}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Sort Bar */}
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={pickerState.search}
                  onChange={(e) => setPickerState(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={pickerState.sort === 'default' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPickerState(prev => ({ ...prev, sort: 'default' }))}
                >
                  Khuyến mãi tốt nhất
                </Button>
                <Button
                  variant={pickerState.sort === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPickerState(prev => ({ ...prev, sort: 'desc' }))}
                >
                  Giá giảm dần
                </Button>
                <Button
                  variant={pickerState.sort === 'asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPickerState(prev => ({ ...prev, sort: 'asc' }))}
                >
                  Giá tăng dần
                </Button>
              </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : paginatedProducts.length === 0 ? (
                <Alert>
                  <AlertDescription>Không tìm thấy sản phẩm phù hợp</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {paginatedProducts.map(product => (
                    <Card key={product.variant_id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={product.img_path || '/placeholder.png'}
                              alt={product.product_name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = '/placeholder.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">
                              {product.product_name}{product.variant_name ? ` - ${product.variant_name}` : ''}
                            </h4>
                            {product.brand && (
                              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                            )}
                            <div className="flex items-center gap-4 mb-2">
                              <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs">
                                <span className="text-green-600">Liên hệ</span>
                                <span className="mx-2">•</span>
                                <span className="text-gray-600">BH: 12 tháng</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Tồn kho: {product.stock || 0}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button
                              onClick={() => handleAddComponent(product)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Thêm
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex justify-center gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/bundles')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Chỉnh sửa Bundle</h1>
              <p className="text-gray-600">Cập nhật thông tin bundle và các linh kiện</p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirm(true)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa Bundle
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="components">Chọn linh kiện</TabsTrigger>
                <TabsTrigger value="pricing">Giá & Giảm giá</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">{renderBasicInfo()}</TabsContent>
              <TabsContent value="components">{renderComponentsTab()}</TabsContent>
              <TabsContent value="pricing">{renderPricingTab()}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/bundles')} 
            disabled={loading}
          >
            Hủy
          </Button>
          {activeTab !== 'pricing' && (
            <Button
              onClick={() => {
                const tabs = ['basic', 'components', 'pricing'];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex + 1]);
              }}
            >
              Tiếp theo
            </Button>
          )}
          {activeTab === 'pricing' && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Bundle</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bundle này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Đang xóa...' : 'Xóa Bundle'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {renderComponentPicker()}

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Bundle</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bundle này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Đang xóa...' : 'Xóa Bundle'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BundleEditPage;
