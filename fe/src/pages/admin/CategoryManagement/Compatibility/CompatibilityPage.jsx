import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  PlusCircle,
  Search,
  Eye,
  Edit,
  Settings,
  Trash2,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { compatibilityService } from '@/services/compatibilityService';

const CompatibilityPage = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ruleId: null });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await compatibilityService.getAllRules();
      console.log('📋 Rules response:', response);
      // API returns { success: true, data: { rules: [...], count: 2, total: 2 } }
      const rulesData = Array.isArray(response.data?.rules) ? response.data.rules : [];
      console.log('📋 Rules data:', rulesData);
      setRules(rulesData);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Không thể tải danh sách rules');
      setRules([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await compatibilityService.deleteRule(deleteDialog.ruleId);
      toast.success('Đã xóa rule thành công');
      fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Không thể xóa rule');
    } finally {
      setDeleteDialog({ open: false, ruleId: null });
    }
  };

  const filteredRules = Array.isArray(rules) 
    ? rules.filter(rule =>
        rule.rule_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Quản lý Tương thích
          </h1>
          <p className="text-muted-foreground mt-1">
            Cấu hình các quy tắc kiểm tra tương thích giữa các linh kiện
          </p>
        </div>
        <Button onClick={() => navigate('/admin/categories/compatibility/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tạo Quy Tắc Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Quy Tắc Tương Thích</CardTitle>
          <CardDescription>
            Các quy tắc để kiểm tra tương thích khi build PC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm quy tắc..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery ? 'Không tìm thấy quy tắc nào' : 'Chưa có quy tắc nào'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Tên Quy Tắc</TableHead>
                    <TableHead className="w-24">Trạng thái</TableHead>
                    <TableHead className="text-right w-48">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.rule_id}>
                      <TableCell className="font-medium">{rule.rule_id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{rule.rule_name}</div>
                        {rule.note && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {rule.note}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.is_active ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="mr-1 h-3 w-3" />
                            Không hoạt động
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/categories/compatibility/rules/${rule.rule_id}/edit`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/categories/compatibility/rules/${rule.rule_id}/mappings`)
                            }
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() =>
                              setDeleteDialog({ open: true, ruleId: rule.rule_id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, ruleId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quy tắc này? Tất cả liên kết liên quan cũng sẽ bị xóa. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompatibilityPage;
