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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { compatibilityService } from '@/services/compatibilityService';
import { attributeValueService } from '@/services/attributeValueService';
import { categoryService } from '@/services/categoryService';

const RuleMappingManager = () => {
  const navigate = useNavigate();
  const { ruleId } = useParams();

  const [loading, setLoading] = useState(false);
  const [rule, setRule] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [attributeValues1, setAttributeValues1] = useState([]);
  const [attributeValues2, setAttributeValues2] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, mappingId: null });
  const [categories, setCategories] = useState([]);
  const [attributes1, setAttributes1] = useState([]);
  const [attributes2, setAttributes2] = useState([]);

  const [newMapping, setNewMapping] = useState({
    value1Id: '',
    value2Id: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchRuleDetails();
    fetchMappings();
  }, [ruleId]);

  useEffect(() => {
    if (rule) {
      fetchAttributes(rule.category_1_id, 1);
      fetchAttributes(rule.category_2_id, 2);
      fetchAttributeValues(rule.attribute_1_id, 1);
      fetchAttributeValues(rule.attribute_2_id, 2);
    }
  }, [rule]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAttributes = async (categoryId, position) => {
    try {
      const response = await categoryService.getAttributesByCategory(categoryId);
      console.log(`🏷️ Attributes response (categoryId=${categoryId}, position ${position}):`, response);
      const attributesData = Array.isArray(response.data) ? response.data : [];
      console.log(`🏷️ Attributes data (position ${position}):`, attributesData);
      if (position === 1) {
        setAttributes1(attributesData);
      } else {
        setAttributes2(attributesData);
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const fetchRuleDetails = async () => {
    try {
      const response = await compatibilityService.getRuleById(ruleId);
      const ruleData = response.data || null;
      setRule(ruleData);
    } catch (error) {
      console.error('Error fetching rule:', error);
      toast.error('Không thể tải thông tin rule');
    }
  };

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const response = await compatibilityService.getRuleMappings(ruleId);
      console.log('🔗 Mappings response:', response);
      // API returns { success: true, data: { ruleId, values: [...], count } }
      const mappingsData = Array.isArray(response.data?.values) ? response.data.values : [];
      console.log('🔗 Mappings data:', mappingsData);
      setMappings(mappingsData);
    } catch (error) {
      console.error('Error fetching mappings:', error);
      toast.error('Không thể tải danh sách mappings');
      setMappings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributeValues = async (attributeId, position) => {
    try {
      // Get categoryId for the specific attribute
      const categoryId = position === 1 ? rule.category_1_id : rule.category_2_id;
      
      // Use categoryService to get attribute values (this endpoint filters correctly)
      const response = await categoryService.getAttributeValuesForCategory(categoryId, attributeId);
      console.log(`📊 Attribute values response (categoryId=${categoryId}, attributeId=${attributeId}, position ${position}):`, response);
      
      const valuesData = Array.isArray(response.data) ? response.data : [];
      console.log(`📊 Attribute values data (position ${position}):`, valuesData);
      
      if (position === 1) {
        setAttributeValues1(valuesData);
      } else {
        setAttributeValues2(valuesData);
      }
    } catch (error) {
      console.error('Error fetching attribute values:', error);
      if (position === 1) {
        setAttributeValues1([]);
      } else {
        setAttributeValues2([]);
      }
    }
  };

  const handleAddMapping = async () => {
    if (!newMapping.value1Id || !newMapping.value2Id) {
      toast.error('Vui lòng chọn đầy đủ giá trị');
      return;
    }

    try {
      await compatibilityService.addRuleMapping(
        ruleId,
        parseInt(newMapping.value1Id),
        parseInt(newMapping.value2Id)
      );
      toast.success('Thêm mapping thành công');
      fetchMappings();
      setNewMapping({ value1Id: '', value2Id: '' });
    } catch (error) {
      console.error('Error adding mapping:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm mapping');
    }
  };

  const handleAutoAddMatching = async () => {
    try {
      let addedCount = 0;
      
      for (const val1 of attributeValues1) {
        // Find matching value in values2
        const val2 = attributeValues2.find(
          v => v.value_name.toLowerCase() === val1.value_name.toLowerCase()
        );
        
        if (val2) {
          // Check if mapping already exists
          const exists = mappings.some(
            m => m.attribute_value_1_id === val1.attribute_value_id &&
                 m.attribute_value_2_id === val2.attribute_value_id
          );
          
          if (!exists) {
            try {
              await api.post(`/compatibility/rules/${ruleId}/values`, {
                attributeValue1Id: val1.attribute_value_id,
                attributeValue2Id: val2.attribute_value_id,
              });
              addedCount++;
            } catch (error) {
              console.error('Error adding auto mapping:', error);
            }
          }
        }
      }
      
      if (addedCount > 0) {
        toast.success(`Đã tự động thêm ${addedCount} mappings`);
        fetchMappings();
      } else {
        toast.info('Không tìm thấy giá trị nào khớp để thêm');
      }
    } catch (error) {
      console.error('Error auto-adding mappings:', error);
      toast.error('Không thể tự động thêm mappings');
    }
  };

  const handleDeleteMapping = async () => {
    try {
      await compatibilityService.deleteRuleMapping(ruleId, deleteDialog.mappingId);
      toast.success('Đã xóa mapping thành công');
      fetchMappings();
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast.error('Không thể xóa mapping');
    } finally {
      setDeleteDialog({ open: false, mappingId: null });
    }
  };

  const getValueName = (valueId, position) => {
    const values = position === 1 ? attributeValues1 : attributeValues2;
    const value = values.find(v => v.id === parseInt(valueId));
    return value?.name || '';
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category?.name || '';
  };

  const getAttributeName = (attributeId, position) => {
    const attributes = position === 1 ? attributes1 : attributes2;
    console.log(`🔍 Getting attribute name for ID ${attributeId} (position ${position}):`, attributes);
    const attribute = attributes.find(a => a.id === parseInt(attributeId));
    console.log(`🔍 Found attribute:`, attribute);
    return attribute?.name || '';
  };
  if (!rule) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories/compatibility')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Quản lý Mappings</h1>
          <p className="text-muted-foreground mt-1">{rule.rule_name}</p>
        </div>
      </div>

      {/* Rule Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Thông tin Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Danh mục 1</p>
              <p className="font-medium">{getCategoryName(rule.category_1_id)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thuộc tính: {getAttributeName(rule.attribute_1_id, 1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Danh mục 2</p>
              <p className="font-medium">{getCategoryName(rule.category_2_id)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thuộc tính: {getAttributeName(rule.attribute_2_id, 2)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Badge variant="outline">{rule.match_type}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add New Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Thêm Mapping Mới
          </CardTitle>
          <CardDescription>
            Thêm cặp giá trị tương thích giữa 2 attributes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label>{getAttributeName(rule.attribute_1_id, 1)}</Label>
              <Select
                value={newMapping.value1Id}
                onValueChange={(value) => setNewMapping({ ...newMapping, value1Id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giá trị" />
                </SelectTrigger>
                <SelectContent>
                  {attributeValues1.filter(val => val?.id).map((val) => (
                    <SelectItem key={val.id} value={val.id.toString()}>
                      {val.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center pb-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label>{getAttributeName(rule.attribute_2_id, 2)}</Label>
              <Select
                value={newMapping.value2Id}
                onValueChange={(value) => setNewMapping({ ...newMapping, value2Id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giá trị" />
                </SelectTrigger>
                <SelectContent>
                  {attributeValues2.filter(val => val?.id).map((val) => (
                    <SelectItem key={val.id} value={val.id.toString()}>
                      {val.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddMapping}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm
            </Button>
          </div>

          <div className="pt-2">
            <Button variant="outline" onClick={handleAutoAddMatching}>
              <Sparkles className="mr-2 h-4 w-4" />
              Tự động thêm các giá trị khớp tên
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách các cặp giá trị tương thích ({mappings.length})</CardTitle>
          <CardDescription>
            Các cặp giá trị đã được cấu hình
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : mappings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Chưa có cặp giá trị tương thích nào. Thêm cặp giá trị tương thích đầu tiên ở trên.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{getAttributeName(rule.attribute_1_id, 1)}</TableHead>
                    <TableHead className="w-16 text-center">
                      <ArrowRight className="h-4 w-4 mx-auto" />
                    </TableHead>
                    <TableHead>{getAttributeName(rule.attribute_2_id, 2)}</TableHead>
                    <TableHead className="w-20 text-right">Xóa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping, index) => (
                    <TableRow key={mapping.cv_id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mapping.value_1_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {mapping.value_2_name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() =>
                            setDeleteDialog({ open: true, mappingId: mapping.cv_id })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, mappingId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mapping này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMapping} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RuleMappingManager;
