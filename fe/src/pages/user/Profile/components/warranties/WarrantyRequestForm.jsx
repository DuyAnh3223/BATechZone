import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const WarrantyRequestForm = ({ product, open, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + formData.images.length > 5) {
            toast.error('Chỉ được upload tối đa 5 ảnh');
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        
        setFormData({
            ...formData,
            images: [...formData.images, ...files]
        });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        URL.revokeObjectURL(imagePreviews[index]);
        
        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject.trim()) {
            toast.error('Vui lòng nhập tiêu đề');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Vui lòng mô tả lỗi');
            return;
        }

        const submitFormData = new FormData();
        submitFormData.append('serial_id', product.serial_id);
        submitFormData.append('warranty_id', product.warranty_id);
        submitFormData.append('subject', formData.subject);
        submitFormData.append('description', formData.description);
        submitFormData.append('request_type', 'warranty');
        
        formData.images.forEach(image => {
            submitFormData.append('images', image);
        });

        try {
            await onSubmit(submitFormData);
            setFormData({ subject: '', description: '', images: [] });
            setImagePreviews([]);
            onClose();
        } catch (error) {
            // Error handled by store
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gửi yêu cầu bảo hành</DialogTitle>
                    <DialogDescription>
                        Sản phẩm: {product?.product_name} - Serial: {product?.serial_number}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="subject">Tiêu đề <span className="text-red-500">*</span></Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="VD: Màn hình bị sọc, bàn phím không hoạt động..."
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Mô tả lỗi <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả chi tiết tình trạng lỗi..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* <div>
                        <Label>Hình ảnh lỗi (tối đa 5 ảnh)</Label>
                        <div className="mt-2">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center">
                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Click để upload</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={formData.images.length >= 5}
                                />
                            </label>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-20 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div> */}

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                        <p className="font-medium mb-1">Lưu ý:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>Sau khi gửi, vui lòng mang sản phẩm đến cửa hàng trong 3 ngày</li>
                            <li>Bạn sẽ nhận được thông báo qua email</li>
                        </ul>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Gửi yêu cầu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WarrantyRequestForm;
