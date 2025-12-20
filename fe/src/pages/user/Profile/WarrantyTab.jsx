import React, { useEffect, useState } from 'react';
import { useWarrantyStore } from '@/stores/useWarrantyStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ProductWarrantyCard from './components/warranties/ProductWarrantyCard';
import WarrantyRequestCard from './components/warranties/WarrantyRequestCard';
import WarrantyRequestForm from './components/warranties/WarrantyRequestForm';
import WarrantyRequestDetail from './components/warranties/WarrantyRequestDetail';
import { Loader2, Search, Package, FileText, AlertCircle } from 'lucide-react';

const WarrantyTab = () => {
    const {
        myProducts,
        myRequests,
        loading,
        fetchMyProducts,
        fetchMyRequests,
        createWarrantyRequest,
        cancelRequest
    } = useWarrantyStore();

    const [activeTab, setActiveTab] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRequestDetail, setShowRequestDetail] = useState(false);

    useEffect(() => {
        fetchMyProducts();
        fetchMyRequests();
    }, []);

    const handleRequestWarranty = (product) => {
        setSelectedProduct(product);
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async (formData) => {
        await createWarrantyRequest(formData);
        setShowRequestForm(false);
        setSelectedProduct(null);
        setActiveTab('requests');
    };

    const handleViewDetail = (request) => {
        setSelectedRequest(request);
        setShowRequestDetail(true);
    };

    const handleCancelRequest = async (requestId) => {
        await cancelRequest(requestId, 'Khách hàng hủy');
        setShowRequestDetail(false);
        setSelectedRequest(null);
    };

    // Filter
    const filteredProducts = myProducts.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = myRequests.filter(request =>
        request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.request_id?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm, serial, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="products" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Sản phẩm ({myProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Yêu cầu BH ({myRequests.length})
                    </TabsTrigger>
                </TabsList>

                {/* Products Tab */}
                <TabsContent value="products" className="mt-4">
                    {loading && myProducts.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'Không tìm thấy' : 'Chưa có sản phẩm'}
                                </h3>
                                <p className="text-gray-500 text-sm text-center">
                                    {searchTerm 
                                        ? 'Thử tìm kiếm với từ khóa khác' 
                                        : 'Bạn chưa mua sản phẩm nào hoặc chưa được kích hoạt bảo hành'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                <div className="text-xs text-blue-800">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>Chỉ sản phẩm còn hạn BH mới có thể gửi yêu cầu</li>
                                        <li>Sau khi gửi, mang sản phẩm đến cửa hàng trong 3 ngày</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map((product) => (
                                    <ProductWarrantyCard
                                        key={product.serial_id}
                                        product={product}
                                        onRequestWarranty={handleRequestWarranty}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Requests Tab */}
                <TabsContent value="requests" className="mt-4">
                    {loading && myRequests.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'Không tìm thấy' : 'Chưa có yêu cầu'}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm 
                                        ? 'Thử tìm kiếm với từ khóa khác' 
                                        : 'Bạn chưa gửi yêu cầu bảo hành nào'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button 
                                        onClick={() => setActiveTab('products')} 
                                        className="mt-4"
                                        size="sm"
                                    >
                                        Xem sản phẩm đã mua
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredRequests.map((request) => (
                                <WarrantyRequestCard
                                    key={request.request_id}
                                    request={request}
                                    onViewDetail={handleViewDetail}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            {selectedProduct && (
                <WarrantyRequestForm
                    product={selectedProduct}
                    open={showRequestForm}
                    onClose={() => {
                        setShowRequestForm(false);
                        setSelectedProduct(null);
                    }}
                    onSubmit={handleSubmitRequest}
                    loading={loading}
                />
            )}

            {selectedRequest && (
                <WarrantyRequestDetail
                    request={selectedRequest}
                    open={showRequestDetail}
                    onClose={() => {
                        setShowRequestDetail(false);
                        setSelectedRequest(null);
                    }}
                    onCancel={handleCancelRequest}
                />
            )}
        </div>
    );
};

export default WarrantyTab;
