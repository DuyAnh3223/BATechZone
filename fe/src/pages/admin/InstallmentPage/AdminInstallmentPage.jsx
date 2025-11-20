import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Settings, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';
import InstallmentList from './components/InstallmentList';
import InstallmentPolicies from './components/InstallmentPolicies';
import InstallmentReports from './components/InstallmentReports';
import OverdueManagement from './components/OverdueManagement';

const AdminInstallmentPage = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trả góp</h1>
          <p className="text-gray-500 mt-1">Quản lý hợp đồng, chính sách và báo cáo trả góp</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Hợp đồng</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Chính sách</span>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Cảnh báo</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Báo cáo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <InstallmentList />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <InstallmentPolicies />
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <OverdueManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <InstallmentReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminInstallmentPage;
