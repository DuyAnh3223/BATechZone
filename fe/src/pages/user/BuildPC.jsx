import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Cpu,
  Filter,
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Trash2,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { productService } from "@/services/productService";
import { variantService } from "@/services/variantService";
import { compatibilityService } from "@/services/compatibilityService";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useUserAuthStore } from "@/stores/useUserAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const componentTypes = [
  { id: "cpu", name: "Bộ vi xử lý", description: "Trái tim của hệ thống.", required: true },
  { id: "mainboard", name: "Bo mạch chủ", description: "Nền tảng kết nối linh kiện.", required: true },
  { id: "ram", name: "RAM", description: "Đa nhiệm và tốc độ phản hồi.", required: true },
  { id: "hdd", name: "HDD", description: "Lưu trữ dung lượng lớn.", required: false },
  { id: "ssd", name: "SSD", description: "Tăng tốc hệ điều hành và ứng dụng.", required: true },
  { id: "vga", name: "VGA", description: "Hiển thị đồ họa, gaming, sáng tạo.", required: false },
  { id: "psu", name: "Nguồn", description: "Cấp năng lượng ổn định.", required: true },
  { id: "case", name: "Vỏ Case", description: "Thiết kế, airflow và mở rộng.", required: true },
  { id: "monitor", name: "Màn hình", description: "Trải nghiệm hình ảnh, màu sắc.", required: false },
  { id: "keyboard", name: "Bàn phím", description: "Gõ phím, nhập liệu, gaming.", required: false },
  { id: "mouse", name: "Chuột", description: "Điều khiển nhanh chóng, chính xác.", required: false },
  { id: "headphone", name: "Tai nghe", description: "Âm thanh tập trung, giao tiếp.", required: false },
  { id: "speaker", name: "Loa", description: "Giải trí, nghe nhạc, xem phim.", required: false },
  { id: "gamingChair", name: "Ghế Gaming", description: "Tư thế ngồi thoải mái, hỗ trợ lâu dài.", required: false },
  { id: "caseFan", name: "Quạt Làm Mát", description: "Cải thiện airflow, hạ nhiệt độ.", required: false },
  { id: "airCooler", name: "Tản nhiệt khí", description: "Giải pháp làm mát CPU phổ biến.", required: false },
  { id: "aioCooler", name: "Tản nhiệt nước All in One", description: "Hiệu quả làm mát cao, gọn gàng.", required: false },
  { id: "customWater", name: "Tản nhiệt nước Custom", description: "Làm mát cao cấp, tùy biến theo ý muốn.", required: false },
];
// Map category IDs từ database
const CATEGORY_MAP = {
  cpu: 1,           // CPU
  mainboard: 5,     // Mainboard
  ram: 35,          // RAM
  vga: 2,           // VGA
  case: 7,          // Case
  ssd: 4,           // SSD
  hdd:  13,          // HDD
  psu: 6,           // PSU
  cooling: 8,       // Cooling
  monitor: 40,      // Monitor
  keyboard:  41,     // Keyboard
  mouse: 42,        // Mouse
  headphone: 43,    // Headphone
  speaker: 44,      // Speaker
  gamingChair: 45,  // Gaming Chair
  caseFan: 46,      // Case Fan
  airCooler: 47,    // Air Cooler
  aioCooler: 48,    // AIO Cooler
  customWater: 49,  // Custom Water
};

const defaultPickerState = {
  open: false,
  type: null,
  search: "",
  brand: "all",
  price: "all",
  sort: "default",
};

const BuildPC = () => {
  const navigate = useNavigate();
  const { user } = useUserAuthStore();
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  
  const [selectedComponents, setSelectedComponents] = useState({});
  // Track compatibility: store variant IDs for core components
  const [compatibilityTracking, setCompatibilityTracking] = useState({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    case: null,
  });
  const [compatibilityFiltersData, setCompatibilityFiltersData] = useState(null);
  const [pickerState, setPickerState] = useState(defaultPickerState);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [attributeFilters, setAttributeFilters] = useState({}); // Dynamic attribute filters
  const [filterOptions, setFilterOptions] = useState(null); // Available filter options from API
  const [productCatalog, setProductCatalog] = useState({}); // Dữ liệu thật từ API
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, typeId: null }); // Delete confirmation
  const [clearConfirm, setClearConfirm] = useState(false); // Clear configuration confirmation
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' }); // Success dialog
  const pageSize = 6;
  const sortTabs = [
    { value: "default", label: "Khuyến mãi tốt nhất" },
    { value: "desc", label: "Giá giảm dần" },
    { value: "asc", label: "Giá tăng dần" },
  ];


  // Fetch compatibility filters from backend
  // const fetchCompatibilityFilters = useCallback(async (typeId) => {
  //   // Only check for core components
  //   if (!['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(typeId)) {
  //     setCompatibilityFiltersData(null);
  //     return;
  //   }

  //   try {
  //     const response = await compatibilityService.getCompatibilityFilters(
  //       typeId,
  //       compatibilityTracking
  //     );
      
  //     if (response.success && response.data) {
  //       setCompatibilityFiltersData(response.data);
  //       console.log('✅ Compatibility filters loaded:', response.data);
        
  //       // Auto-apply compatibility filters to attributeFilters state
  //       if (response.data.filters && response.data.filters.length > 0) {
  //         const autoFilters = {};
          
  //         response.data.filters.forEach(filter => {
  //           const { attributeId, compatibleValues } = filter;
            
  //           // Extract attribute_value_ids from compatibleValues
  //           const valueIds = compatibleValues.map(cv => cv.attribute_value_id);
            
  //           if (valueIds.length > 0) {
  //             autoFilters[attributeId] = valueIds;
  //           }
  //         });
          
  //         if (Object.keys(autoFilters).length > 0) {
  //           setAttributeFilters(autoFilters);
  //           console.log('✅ Auto-applied filters:', autoFilters);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching compatibility filters for ${typeId}:`, error);
  //     setCompatibilityFiltersData(null);
  //   }
  // }, [compatibilityTracking]);

  const fetchCompatibilityFilters = useCallback(async (typeId) => {
    // Map typeId to categoryId
    const CATEGORY_MAP = {
      cpu: 1,
      mainboard: 5,
      ram: 35,
      vga: 2,
      case: 7
    };

    const targetCategoryId = CATEGORY_MAP[typeId];
    if (!targetCategoryId) {
      setCompatibilityFiltersData(null);
      return;
    }

    // Convert compatibilityTracking (typeId -> variantId) to (categoryId -> variantId)
    const mappedComponents = {};
    Object.entries(compatibilityTracking).forEach(([type, variantId]) => {
      const catId = CATEGORY_MAP[type];
      if (catId && variantId) {
        mappedComponents[catId] = variantId;
      }
    });

    try {
      const response = await compatibilityService.getCompatibilityFilters(
        targetCategoryId,
        mappedComponents
      );
      
      if (response.success && response.data) {
        setCompatibilityFiltersData(response.data);
        console.log('✅ Compatibility filters loaded:', response.data);
        
        // ✨ AUTO-APPLY FILTERS: Tự động check checkboxes
        if (response.data.filters && response.data.filters.length > 0) {
          const autoFilters = {};
          
          response.data.filters.forEach(filter => {
            const { attributeId, compatibleValues } = filter;
            
            // Extract attribute_value_ids
            const valueIds = compatibleValues.map(cv => cv.attribute_value_id);
            
            if (valueIds.length > 0) {
              autoFilters[attributeId] = valueIds;
            }
          });
          
          if (Object.keys(autoFilters).length > 0) {
            setAttributeFilters(autoFilters);
            console.log('✅ Auto-applied compatibility filters:', autoFilters);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching compatibility filters:`, error);
      setCompatibilityFiltersData(null);
    }
  }, [compatibilityTracking]);

  // Fetch filter options (brands, attributes, price range) for a component type
  const fetchFilterOptions = useCallback(async (typeId) => {
    const categoryId = CATEGORY_MAP[typeId];
    if (!categoryId) {
      console.warn(`No category mapping for type: ${typeId}`);
      return;
    }

    try {
      const response = await productService.getFilterOptions(categoryId);
      if (response.success && response.data) {
        setFilterOptions(response.data);
        
        // Initialize price range if available
        if (response.data.priceRange) {
          setPriceRange([response.data.priceRange.min, response.data.priceRange.max]);
        }
      }
    } catch (error) {
      console.error(`Error fetching filter options for ${typeId}:`, error);
      setFilterOptions(null);
    }
  }, []);

  // Fetch products từ API khi mở picker
  const fetchProductsForType = useCallback(async (typeId) => {
    const categoryId = CATEGORY_MAP[typeId];
    if (!categoryId) {
      console.warn(`No category mapping for type: ${typeId}`);
      return;
    }

    // Nếu đã có data trong cache, không fetch lại
    if (productCatalog[typeId]?.length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await productService.getProductsWithAttributes({ category_id: categoryId, is_active: 1 });
      
      if (response.success && response.data) {
        // Transform API data to match mock format - SHOW ALL VARIANTS with ATTRIBUTES
        const transformedProducts = [];
        
        for (const product of response.data) {
          // Nếu có variants, tạo entry cho mỗi variant
          if (product.variants?.length > 0) {
            for (const variant of product.variants) {
              // Build attributes object for display from variant or product
              const attributesArray = variant.attribute_values?.length > 0 
                ? variant.attribute_values 
                : product.attributes || [];
              
              const attrs = {};
              attributesArray.forEach(attr => {
                attrs[attr.attribute_name] = attr.value_name;
              });
              
              const brand = attrs['Hãng'] || attrs['Nhà sản xuất'] || attrs['Thương hiệu'] || 'N/A';
              
              // Lấy hình ảnh của variant từ variant images
              let imageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
              
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
                id: `${product.slug}-${variant.variant_id}`,
                variantId: variant.variant_id,
                productId: product.product_id,
                sku: variant.sku,
                // Hiển thị tên sản phẩm + variant name để phân biệt
                name: `${product.product_name}${variant.variant_name ? ` - ${variant.variant_name}` : ''}`,
                brand,
                socket: attrs['Socket'],
                chipset: attrs['Chipset'],
                generation: attrs['Dòng sản phẩm'],
                series: attrs['Dòng card'] || attrs['Dòng sản phẩm'],
                price: parseFloat(variant.price) || parseFloat(product.base_price) || 0,
                stock: variant.stock || 0,
                warranty: '12 tháng',
                image: imageUrl,
                description: product.description || '',
                highlights: [],
                attributes: attrs, // Object for display
                attributesRaw: attributesArray, // Raw array for filtering
              });
            }
          } else {
            // Nếu không có variants, dùng thông tin product
            const attributesArray = product.attributes || [];
            const attributesObj = {};
            attributesArray.forEach(attr => {
              attributesObj[attr.attribute_name] = attr.value_name;
            });
            
            let imageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
            
            if (product.img_path) {
              imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${product.img_path}`;
            }
            
            transformedProducts.push({
              id: product.slug,
              productId: product.product_id,
              sku: product.slug,
              name: product.product_name,
              brand: 'N/A',
              price: parseFloat(product.base_price) || 0,
              stock: 0,
              warranty: 'N/A',
              image: imageUrl,
              description: product.description || '',
              highlights: [],
              attributes: attributesObj,
              attributesRaw: attributesArray, // Raw array for filtering
            });
          }
        }

        setProductCatalog(prev => ({
          ...prev,
          [typeId]: transformedProducts
        }));
      }
    } catch (error) {
      console.error(`Error fetching products for ${typeId}:`, error);
      // Fallback to empty array
      setProductCatalog(prev => ({
        ...prev,
        [typeId]: []
      }));
    } finally {
      setLoading(false);
    }
  }, [productCatalog]);

  const handleBrandToggle = (brand) => {
    setBrandFilters((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleAttributeToggle = (attributeId, valueId) => {
    setAttributeFilters((prev) => {
      const current = prev[attributeId] || [];
      const newValues = current.includes(valueId)
        ? current.filter((v) => v !== valueId)
        : [...current, valueId];
      
      if (newValues.length === 0) {
        const { [attributeId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [attributeId]: newValues
      };
    });
  };

  const handleResetFilters = () => {
    if (filterOptions?.priceRange) {
      setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max]);
    } else {
      setPriceRange([0, 0]);
    }
    setBrandFilters([]);
    setAttributeFilters({});
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const calculateTotal = useMemo(
    () =>
      Object.entries(selectedComponents).reduce(
        (sum, [type, component]) =>
          sum + (component?.price || 0) * (quantities[type] || 1),
        0
      ),
    [selectedComponents, quantities]
  );

  const openPicker = async (type) => {
    // Reset all filters
    setPriceRange([0, 0]);
    setBrandFilters([]);
    setAttributeFilters({});
    
    // Fetch data
    await fetchFilterOptions(type);
    await fetchCompatibilityFilters(type);
    await fetchProductsForType(type);
    
    setPickerState({
        ...defaultPickerState,
        open: true,
        type,
    });
    setCurrentPage(1);
};

  const closePicker = () => {
    setPickerState(defaultPickerState);
    setCurrentPage(1);
    setPriceRange([0, 0]);
    setBrandFilters([]);
    setAttributeFilters({});
    setFilterOptions(null);
    setCompatibilityFiltersData(null);
  };

  const handleAddComponent = (component) => {
    if (!pickerState.type) return;
    
    const componentName = componentTypes.find(t => t.id === pickerState.type)?.name || 'linh kiện';
    const isUpdate = !!selectedComponents[pickerState.type]; // Check if updating existing component
    
    setSelectedComponents((prev) => ({
      ...prev,
      [pickerState.type]: component,
    }));
    setQuantities((prev) => ({
      ...prev,
      [pickerState.type]: prev[pickerState.type] || 1,
    }));
    
    // Update compatibility tracking for core components
    if (['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(pickerState.type)) {
      setCompatibilityTracking((prev) => ({
        ...prev,
        [pickerState.type]: component.variantId,
      }));
    }
    
    closePicker();
    
    // Hiển thị success dialog
    if (isUpdate) {
      setSuccessDialog({ 
        open: true, 
        message: `Đã cập nhật ${componentName} thành công!` 
      });
    } else {
      setSuccessDialog({ 
        open: true, 
        message: `Đã thêm ${componentName} vào cấu hình thành công!` 
      });
    }
  };

  const handleQuantityAdjust = (type, delta) => {
    setQuantities((prev) => {
      const current = prev[type] || 1;
      const nextValue = Math.max(1, current + delta);
      return {
        ...prev,
        [type]: nextValue,
      };
    });
    setSuccessDialog({ open: true, message: 'Đã cập nhật số lượng thành công!' });
  };

  const handleQuantityInput = (type, value) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(1, Number(value) || 1),
    }));
    setSuccessDialog({ open: true, message: 'Đã cập nhật số lượng thành công!' });
  };

  const handleRemoveComponent = (type) => {
    setDeleteConfirm({ open: true, typeId: type });
  };

  const handleClearConfiguration = () => {
    setClearConfirm(true);
  };

  const confirmClearConfiguration = () => {
    setSelectedComponents({});
    setQuantities({});
    setCompatibilityTracking({
      cpu: null,
      mainboard: null,
      ram: null,
      vga: null,
      case: null,
    });
    setClearConfirm(false);
    setSuccessDialog({ open: true, message: 'Đã xóa toàn bộ cấu hình thành công!' });
  };

  const confirmRemoveComponent = () => {
    const type = deleteConfirm.typeId;
    if (!type) return;
    
    const componentName = componentTypes.find(t => t.id === type)?.name || 'linh kiện';
    
    setSelectedComponents((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
    
    // Clear compatibility tracking
    if (['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(type)) {
      setCompatibilityTracking((prev) => ({
        ...prev,
        [type]: null,
      }));
    }
    
    setDeleteConfirm({ open: false, typeId: null });
    
    // Hiển thị success dialog
    setSuccessDialog({ 
      open: true, 
      message: `Đã xóa ${componentName} khỏi cấu hình thành công!` 
    });
  };

  const handleAddToCart = async () => {
    if (calculateTotal === 0) {
      toast.error('Vui lòng chọn ít nhất một linh kiện');
      return;
    }

    try {
      // 1. Get or create cart
      let cartData = {};
      if (user) {
        cartData.userId = user.user_id;
      } else {
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guest_session_id', sessionId);
        }
        cartData.sessionId = sessionId;
      }

      const cartResponse = await getOrCreateCart(cartData);
      const cart = cartResponse?.data || cartResponse;
      const cartId = cart?.cart_id || cart?.cartId;

      if (!cartId) {
        throw new Error('Không thể tạo giỏ hàng');
      }

      // 2. Add all selected components to cart
      const addPromises = Object.entries(selectedComponents).map(async ([type, component]) => {
        const quantity = quantities[type] || 1;
        const variantId = component.variantId;

        if (!variantId) {
          console.warn(`Component ${type} không có variantId:`, component);
          return;
        }

        return addToCart({
          cartId,
          variantId,
          quantity,
        });
      });

      await Promise.all(addPromises);

      const componentCount = Object.keys(selectedComponents).length;
      setSuccessDialog({ 
        open: true, 
        message: `Đã thêm ${componentCount} linh kiện vào giỏ hàng thành công!` 
      });
      
      // Clear selected components
      setSelectedComponents({});
      setQuantities({});

      // Navigate to cart after dialog is closed
      setTimeout(() => {
        navigate('/cart');
      }, 1500);

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const catalogItems = useMemo(
    () => {
      if (!pickerState.type) return [];
      // Ưu tiên dùng productCatalog (dữ liệu thật), fallback về mockCatalog
      return productCatalog[pickerState.type] || mockCatalog[pickerState.type] || [];
    },
    [pickerState.type, productCatalog]
  );

  const priceBounds = useMemo(() => {
    if (!filterOptions?.priceRange) {
      return { min: 0, max: 0 };
    }
    return {
      min: 0,
      max: filterOptions.priceRange.max,
    };
  }, [filterOptions]);

  const filteredComponents = useMemo(() => {
    if (!pickerState.type) return [];
    let items = [...catalogItems];

    // Compatibility filter is now handled by attributeFilters state (auto-ticked checkboxes)
    // No need for separate compatibility logic here

    if (pickerState.search) {
      const query = pickerState.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      );
    }

    const [minPrice, maxPrice] = priceRange;
    if (maxPrice > 0) {
      items = items.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );
    }

    if (brandFilters.length) {
      items = items.filter((item) => brandFilters.includes(item.brand));
    }

    // Filter by dynamic attributes (giống ProductList.jsx)
    if (Object.keys(attributeFilters).length > 0) {
      items = items.filter((item) => {
        const itemAttributes = item.attributesRaw || [];
        
        if (itemAttributes.length === 0) {
          return false;
        }
        
        // Check if item satisfies all selected attribute filters
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

    if (pickerState.sort === "asc") {
      items.sort((a, b) => a.price - b.price);
    }

    if (pickerState.sort === "desc") {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [catalogItems, pickerState.search, pickerState.sort, priceRange, brandFilters, attributeFilters, filterOptions, compatibilityFiltersData]);

  const brandOptions = useMemo(() => {
    return filterOptions?.brands || [];
  }, [filterOptions]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComponents.length / pageSize)
  );

  const paginatedComponents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComponents.slice(start, start + pageSize);
  }, [filteredComponents, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i += 1) {
      buttons.push(i);
    }
    return buttons;
  }, [currentPage, totalPages]);


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 space-y-6">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-6 py-2 text-lg font-semibold text-orange-600">
              <Cpu className="h-5 w-5" />
              Công cụ Build PC
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Xây dựng cấu hình PC</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Quản lý toàn bộ danh sách linh kiện trên một trang, dễ dàng chọn, lọc và sắp xếp sản phẩm dựa trên kho dữ liệu BATechZone.
            </p>
          </div>

          <div className="w-full space-y-6">
            {/* Main table of component slots */}
            <Card className="w-full shadow-lg rounded-xl overflow-hidden border-2">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle>Danh sách linh kiện</CardTitle>
            <CardDescription>Chọn từng hạng mục để hoàn thiện cấu hình của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Thông tin linh kiện</TableHead>
                    <TableHead className="text-center whitespace-nowrap">Số lượng</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentTypes.map((type, idx) => (
                    <TableRow key={type.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className="font-semibold flex items-center gap-1">
                          {type.name}
                        </div>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </TableCell>
                      <TableCell>
                        {selectedComponents[type.id] ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedComponents[type.id].image}
                              alt={selectedComponents[type.id].name}
                              className="h-12 w-12 rounded-md border object-cover"
                            />
                            <div>
                              <p className="font-medium">{selectedComponents[type.id].name}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedComponents[type.id].brand} • {selectedComponents[type.id].sku}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Chưa chọn</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {selectedComponents[type.id] ? (
                          <div className="inline-flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityAdjust(type.id, -1)}>-</Button>
                            <Input
                              type="number"
                              min={1}
                              value={quantities[type.id] || 1}
                              onChange={(e) => handleQuantityInput(type.id, e.target.value)}
                              className="w-16 text-center"
                            />
                            <Button variant="outline" size="icon" onClick={() => handleQuantityAdjust(type.id, 1)}>+</Button>
                          </div>
                        ) : (
                          "--"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {selectedComponents[type.id]
                          ? formatPrice((selectedComponents[type.id].price || 0) * (quantities[type.id] || 1))
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        {selectedComponents[type.id] ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openPicker(type.id)}
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 mr-1"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveComponent(type.id)}
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => openPicker(type.id)}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 py-2 has-[>svg]:px-3 w-full rounded-full sm:w-auto sm:flex-shrink-0 h-9 px-3 text-xs"
                          >
                            <PlusCircle />Thêm linh kiện
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t p-6">
            <div>
              <p className="text-base text-muted-foreground font-medium">Tổng giá trị tạm tính</p>
              <p className="text-3xl font-bold text-red-600">{formatPrice(calculateTotal)}</p>
            </div>
            {/* <div className="flex gap-3">
              <Button disabled={calculateTotal === 0}>Thêm vào giỏ hàng</Button>
            </div> */}
          </div>
        </Card>

          {/* Summary card - below table on mobile, sticky on right on large screens */}
          <Card className="w-full lg:sticky lg:top-20 shadow-lg rounded-xl border-2">
          <CardHeader>
            <CardTitle>Cấu hình đã chọn</CardTitle>
            <CardDescription>Tóm tắt nhanh các linh kiện đang có trong build của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[60vh] overflow-auto">
            {Object.keys(selectedComponents).length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có linh kiện nào được chọn.</div>
            ) : (
              Object.entries(selectedComponents).map(([type, component]) => (
                <div key={type} className="flex items-center gap-3 border rounded-lg p-3">
                  <img
                    src={component.image}
                    alt={component.name}
                    className="h-16 w-16 rounded-md border object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">{componentTypes.find((t) => t.id === type)?.name}</p>
                    <p className="text-sm font-semibold line-clamp-2">{component.name}</p>
                    <p className="text-xs text-muted-foreground">Số lượng: {quantities[type] || 1}</p>
                  </div>
                  <span className="font-semibold text-red-500 flex-shrink-0">{formatPrice(component.price * (quantities[type] || 1))}</span>
                </div>
              ))
            )}

            <div className="flex flex-col gap-2 border-t pt-3">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatPrice(calculateTotal)}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700" 
                  onClick={handleClearConfiguration}
                  disabled={calculateTotal === 0}
                >
                  Xóa cấu hình
                </Button>
                <Button size="lg" className="flex-1" disabled={calculateTotal === 0} onClick={handleAddToCart}>
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
    <Dialog open={pickerState.open} onOpenChange={(open) => !open && closePicker()}>
        <DialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90vw] !h-[90vh] !max-w-none !p-0 !gap-0 !border-0 !rounded-lg !overflow-hidden !grid !grid-cols-1">
          <DialogHeader className="sr-only">
            <DialogTitle>Chọn linh kiện cho cấu hình</DialogTitle>
            <DialogDescription>
              Tìm kiếm, lọc và thêm linh kiện phù hợp vào cấu hình Build PC.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] w-full h-full gap-0 bg-white overflow-hidden flex-1">
            {/* Left: Filters */}
            <div className="border-r bg-white overflow-hidden flex flex-col min-w-0 h-full">
              <div className="bg-blue-700 px-3 py-2 text-white font-semibold flex-shrink-0 text-sm">
                Bộ lọc
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3" style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#94a3b8 #f1f5f9'
              }}>
                <div className="space-y-4 pr-1 w-full">
                  {/* Price Range Filter */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Khoảng giá</span>
                      <span>
                        {formatPrice(priceRange[0] || priceBounds.min)} -{" "}
                        {formatPrice(priceRange[1] || priceBounds.max)}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={priceBounds.min}
                      max={Math.max(priceBounds.max, priceBounds.min + 1)}
                      step={50000}
                      onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPrice(priceBounds.min)}</span>
                      <span>{formatPrice(priceBounds.max)}</span>
                    </div>
                  </section>

                  {/* Brand Filter */}
                  {brandOptions.length > 0 && (
                    <section className="space-y-3">
                      <p className="text-sm font-semibold">Thương hiệu</p>
                      <div className="space-y-2">
                        {brandOptions.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            <Checkbox
                              checked={brandFilters.includes(brand)}
                              onCheckedChange={() => handleBrandToggle(brand)}
                            />
                            {brand}
                          </label>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Dynamic Attribute Filters */}
                  {/* {filterOptions?.attributes && filterOptions.attributes.map((attr) => (
                    <section key={attr.attribute_id} className="space-y-3">
                      <p className="text-sm font-semibold">{attr.attribute_name}</p>
                      <div className="space-y-2">
                        {attr.values.map((value) => (
                          <label
                            key={value.attribute_value_id}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            <Checkbox
                              checked={attributeFilters[attr.attribute_id]?.includes(value.attribute_value_id) || false}
                              onCheckedChange={() => handleAttributeToggle(attr.attribute_id, value.attribute_value_id)}
                            />
                            {value.value_name}
                          </label>
                        ))}
                      </div>
                    </section>
                  ))} */}
                  {/* Trong phần render filters */}
                  {filterOptions?. attributes && filterOptions. attributes.map((attr) => (
                      <section key={attr.attribute_id} className="space-y-3">
                          <p className="text-sm font-semibold">
                              {attr. attribute_name}
                              {/* ✨ Badge cho compatibility filter */}
                              {compatibilityFiltersData?.filters?.some(f => f.attributeId === attr. attribute_id) && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      Tự động lọc
                                  </span>
                              )}
                          </p>
                          <div className="space-y-2">
                              {attr.values.map((value) => {
                                  const isAutoChecked = attributeFilters[attr.attribute_id]?.includes(value. attribute_value_id);
                                  const isCompatibility = compatibilityFiltersData?.filters
                                      ?.find(f => f.attributeId === attr.attribute_id)
                                      ?.compatibleValues.some(cv => cv.attribute_value_id === value.attribute_value_id);
                                  
                                  return (
                                      <label
                                          key={value.attribute_value_id}
                                          className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${
                                              isCompatibility ? 'text-blue-700 bg-blue-50 p-1 rounded' : 'text-slate-700'
                                          }`}
                                      >
                                          <Checkbox
                                              checked={isAutoChecked || false}
                                              onCheckedChange={() => handleAttributeToggle(attr.attribute_id, value.attribute_value_id)}
                                          />
                                          {value.value_name}
                                          {isCompatibility && (
                                              <CheckCircle className="h-3 w-3 text-blue-600" />
                                          )}
                                      </label>
                                  );
                              })}
                          </div>
                      </section>
                  ))}

                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="w-full">
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Products */}
            <div className="flex flex-col overflow-hidden min-w-0 h-full bg-white">
              <div className="flex-shrink-0 border-b bg-white p-3 space-y-2">
                {/* Compatibility Info Banner */}
                {compatibilityFiltersData?.filters && compatibilityFiltersData.filters.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Lọc theo tương thích</p>
                        {compatibilityFiltersData.filters.map((filter, index) => (
                          <p key={index} className="text-xs text-blue-700">
                            • {filter.ruleName}: {filter.compatibleValues.map(cv => cv.value_name).join(', ')}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9 h-9 text-sm"
                    value={pickerState.search}
                    onChange={(e) =>
                      setPickerState((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {sortTabs.map((tab) => (
                    <Button
                      key={tab.value}
                      variant={pickerState.sort === tab.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs h-8 px-3"
                      onClick={() =>
                        setPickerState((prev) => ({
                          ...prev,
                          sort: tab.value,
                        }))
                      }
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tìm thấy {filteredComponents.length} sản phẩm
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="p-3 space-y-2">
                  {loading ? (
                    <Card>
                      <CardContent className="py-10 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground">Đang tải sản phẩm...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : paginatedComponents.length === 0 ? (
                    <Card>
                      <CardContent className="py-6 text-center text-xs text-muted-foreground">
                        Không có sản phẩm phù hợp.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {paginatedComponents.map((item) => (
                        <Card key={item.id} className="border shadow-sm">
                          <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-24 w-24 rounded-lg border object-contain flex-shrink-0"
                            />
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                <div className="min-w-0">
                                  <p className="text-xs uppercase text-muted-foreground">
                                    {item.brand}
                                  </p>
                                  <p className="font-semibold leading-tight text-sm">
                                    {item.name}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-red-600 flex-shrink-0">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                {(item.highlights || []).slice(0, 2).map((highlight) => (
                                  <span
                                    key={highlight}
                                    className="rounded-full bg-muted px-2 py-0.5"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-600">
                                <span>{item.stock > 0 ? "Còn hàng" : "Liên hệ"}</span>
                                {item.warranty && <span>BH: {item.warranty}</span>}
                              </div>
                            </div>
                            <Button
                              className="w-full rounded-full sm:w-auto sm:flex-shrink-0 h-9 px-3 text-xs"
                              onClick={() => handleAddComponent(item)}
                            >
                              <PlusCircle className="mr-1 h-3 w-3" />
                              Thêm
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex-shrink-0 border-t bg-white p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    Trang {currentPage}/{totalPages}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center gap-0.5">
                      {pageNumbers.map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0 text-xs"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => !open && setDeleteConfirm({ open: false, typeId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa linh kiện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa linh kiện này khỏi cấu hình? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveComponent} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Configuration Confirmation Dialog */}
      <AlertDialog open={clearConfirm} onOpenChange={(open) => !open && setClearConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cấu hình</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa toàn bộ cấu hình hiện tại? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearConfiguration}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={successDialog.open} onOpenChange={(open) => {
        setSuccessDialog({ open, message: '' });
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
              {successDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={() => setSuccessDialog({ open: false, message: '' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuildPC;
