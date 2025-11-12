import React, { useMemo, useState } from 'react';
import { Users, Box, DollarSign, Eye } from "lucide-react";

const summary = {
	users: 1286,
	products: 523,
	revenue: 125400000,
	watchlisted: 84,
};

const recentOrders = [
	{ id: 'ORD-001', customer: 'John Doe', total: 19170000, status: 'Hoàn thành', key: 'delivered', method: 'Bank', created_at: '2024-05-01' },
	{ id: 'ORD-002', customer: 'Jane Smith', total: 45990000, status: 'Đang giao', key: 'shipping', method: 'Card', created_at: '2024-05-03' },
	{ id: 'ORD-003', customer: 'Alice', total: 2890000, status: 'Chờ thanh toán', key: 'pending', method: 'COD', created_at: '2024-05-04' },
	{ id: 'ORD-004', customer: 'Tom', total: 5500000, status: 'Đã hủy', key: 'cancelled', method: 'COD', created_at: '2024-05-06' },
];

const topSelling = [
	{ product: 'Intel Core i9-13900K', category: 'CPU', sold: 120, price: 12990000, stock: 50 },
	{ product: 'NVIDIA RTX 4090', category: 'VGA', sold: 48, price: 45990000, stock: 2 },
	{ product: 'Corsair DDR5 16GB', category: 'RAM', sold: 96, price: 3290000, stock: 100 },
];

const topViewedVariants = [
	{ variant_id: 1, product_name: 'Intel Core i9-13900K', variant_name: 'Box', views: 320 },
	{ variant_id: 3, product_name: 'NVIDIA RTX 4090', variant_name: '24GB', views: 180 },
	{ variant_id: 7, product_name: 'Corsair Vengeance DDR5', variant_name: '16GB', views: 155 },
];

const topReportedVariants = [
	{ variant_id: 1002, product_name: 'Sản phẩm X', report_count: 7 },
	{ variant_id: 2005, product_name: 'Sản phẩm Y', report_count: 5 },
];

const topActiveUsers = [
	{ user_id: 2, username: 'john_doe', recent_views: 24 },
	{ user_id: 3, username: 'jane_smith', recent_views: 18 },
	{ user_id: 1, username: 'admin', recent_views: 10 },
];

// Bar chart mock for Orders overview
const BarChart = ({data}) => (
	<div className="w-full h-60 flex items-end gap-2 p-4 bg-white rounded-xl shadow">
		{data.map((v, i) => (
			<div key={i} className="flex-1 flex flex-col items-center">
				<div className="w-full bg-blue-100 rounded" style={{height: '100%'}}>
					<div className="bg-gradient-to-b from-blue-600 to-indigo-600 rounded" style={{height: `${v*100}%`}} />
				</div>
				<div className="text-xs text-gray-500 mt-1">W{i+1}</div>
			</div>
		))}
	</div>
);

// Multi segment pie using conic-gradient
const PieMulti = ({segments}) => {
	const total = segments.reduce((t, s) => t + s.value, 0) || 1;
	let acc = 0;
	const stops = segments.map((s) => {
		const start = (acc / total) * 100;
		acc += s.value;
		const end = (acc / total) * 100;
		return `${s.color} ${start}% ${end}%`;
	}).join(', ');
	return (
		<div className="relative w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
			<div className="absolute inset-0" style={{background: `conic-gradient(${stops})`}} />
			<div className="absolute inset-3 rounded-full bg-white" />
		</div>
	);
};

const Legend = ({segments}) => (
	<ul className="text-sm space-y-1">
		{segments.map((s) => (
			<li key={s.label} className="flex items-center gap-2">
				<span className="inline-block w-3 h-3 rounded" style={{background: s.color}} />
				<span className="text-gray-700">{s.label}</span>
				<span className="ml-auto text-gray-500">{s.value}</span>
			</li>
		))}
	</ul>
);

// Phân bổ danh mục sản phẩm
const categorySegments = [
	{ label: 'CPU', value: 2, color: '#2563eb' },
	{ label: 'VGA', value: 2, color: '#10b981' },
	{ label: 'RAM', value: 2, color: '#f59e0b' },
	{ label: 'SSD', value: 2, color: '#ef4444' },
	{ label: 'Laptop', value: 2, color: '#8b5cf6' },
];

// Trạng thái đơn hàng
const computeStatusSegments = () => {
	const map = {
		delivered: { label: 'Hoàn thành', color: '#16a34a', value: 0 },
		cancelled: { label: 'Đã hủy', color: '#ef4444', value: 0 },
		shipping: { label: 'Đang giao', color: '#2563eb', value: 0 },
		pending: { label: 'Chờ xử lý', color: '#f59e0b', value: 0 },
	};
	recentOrders.forEach(o => { if (map[o.key]) map[o.key].value += 1; });
	return Object.values(map);
};

const Card = ({title, value, icon, accentClass = "bg-blue-50 text-blue-600"}) => (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
        <div className={`shrink-0 rounded-lg ${accentClass} p-3`}>{icon}</div>
        <div>
            <div className="text-gray-500 text-sm">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    </div>
);

const ViewCard = ({title, children}) => (
	<div className="bg-white rounded-xl shadow p-5">
		<div className="text-lg font-semibold mb-3">{title}</div>
		{children}
	</div>
);

const AdminDashboard = () => {
	const [start, setStart] = useState('2024-05-01');
	const [end, setEnd] = useState('2024-05-31');
	const statusSegments = computeStatusSegments();

	// Tính dữ liệu biểu đồ cột theo khoảng thời gian (demo: tuần)
	const barData = useMemo(() => {
		// giả lập 5 tuần, tăng giảm theo ngày bắt đầu/kết thúc để có biến đổi
		const seed = new Date(start).getDate() % 7;
		const base = [0.4, 0.6, 0.2, 0.8, 0.5];
		return base.map((v, i) => Math.max(0.1, Math.min(1, v + ((seed + i) % 3 - 1) * 0.1)));
	}, [start, end]);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Trang quản trị BATechZone</h1>

			{/* Tổng quan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card title="Tổng người dùng" value={summary.users} icon={<Users className="size-6"/>} accentClass="bg-blue-50 text-blue-600" />
                <Card title="Tổng sản phẩm" value={summary.products} icon={<Box className="size-6"/>} accentClass="bg-violet-50 text-violet-600" />
                <Card title="Doanh thu" value={summary.revenue.toLocaleString('vi-VN') + ' ₫'} icon={<DollarSign className="size-6"/>} accentClass="bg-emerald-50 text-emerald-600" />
                <Card title="Sản phẩm được theo dõi" value={summary.watchlisted} icon={<Eye className="size-6"/>} accentClass="bg-amber-50 text-amber-600" />
            </div>

			{/* Tổng quan đơn hàng (Biểu đồ cột) với chọn thời gian */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<div className="text-lg font-semibold">Tổng quan đơn hàng</div>
					<div className="flex items-center gap-2 text-sm">
						<input type="date" value={start} onChange={(e)=>setStart(e.target.value)} className="border rounded px-3 py-1.5" />
						<span>—</span>
						<input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} className="border rounded px-3 py-1.5" />
						<button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded">Lọc</button>
					</div>
				</div>
				<BarChart data={barData} />
			</div>

			{/* Phân bổ danh mục & Trạng thái đơn hàng */}
			<div className="grid md:grid-cols-2 gap-4">
				<div className="bg-white rounded-xl shadow p-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="text-lg font-semibold">Phân bổ danh mục sản phẩm</div>
							<div className="text-xs text-gray-500">Theo dữ liệu mẫu trong database</div>
							<div className="mt-3">
								<Legend segments={categorySegments} />
							</div>
						</div>
						<PieMulti segments={categorySegments} />
					</div>
				</div>
				<div className="bg-white rounded-xl shadow p-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="text-lg font-semibold">Trạng thái đơn hàng</div>
							<div className="text-xs text-gray-500">Hoàn thành / Đã hủy / Đang giao / Chờ xử lý</div>
							<div className="mt-3">
								<Legend segments={statusSegments} />
							</div>
						</div>
						<PieMulti segments={statusSegments} />
					</div>
				</div>
			</div>

			{/* Đơn hàng gần đây & Sản phẩm bán chạy */}
			<div className="grid md:grid-cols-2 gap-4">
				<div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
					<div className="text-lg font-semibold mb-3">Đơn hàng gần đây</div>
					<table className="min-w-[700px] w-full text-left">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2">ID</th>
								<th className="px-4 py-2">Khách hàng</th>
								<th className="px-4 py-2">Tổng tiền</th>
								<th className="px-4 py-2">Trạng thái</th>
								<th className="px-4 py-2">Phương thức</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{recentOrders.map(o => (
								<tr key={o.id}>
									<td className="px-4 py-2">{o.id}</td>
									<td className="px-4 py-2">{o.customer}</td>
									<td className="px-4 py-2">{o.total.toLocaleString('vi-VN')} ₫</td>
									<td className="px-4 py-2">{o.status}</td>
									<td className="px-4 py-2">{o.method}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
					<div className="text-lg font-semibold mb-3">Sản phẩm bán chạy</div>
					<table className="min-w-[700px] w-full text-left">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2">Sản phẩm</th>
								<th className="px-4 py-2">Danh mục</th>
								<th className="px-4 py-2 text-right">Số lượng bán</th>
								<th className="px-4 py-2 text-right">Giá</th>
								<th className="px-4 py-2 text-right">Tồn kho</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{topSelling.map(p => (
								<tr key={p.product}>
									<td className="px-4 py-2">{p.product}</td>
									<td className="px-4 py-2">{p.category}</td>
									<td className="px-4 py-2 text-right">{p.sold}</td>
									<td className="px-4 py-2 text-right">{p.price.toLocaleString('vi-VN')} ₫</td>
									<td className="px-4 py-2 text-right">{p.stock}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Recent Views Section */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-gray-800">Thống kê lượt xem</h2>
				</div>
				<div className="grid md:grid-cols-2 gap-4">
					<ViewCard title="Top variants theo lượt xem">
						<div className="overflow-x-auto">
							<table className="min-w-[600px] w-full text-left">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2">ID Phiên bản</th>
										<th className="px-4 py-2">Sản phẩm</th>
										<th className="px-4 py-2">Biến thể</th>
										<th className="px-4 py-2 text-right">Lượt xem</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{topViewedVariants.map(v => (
										<tr key={v.variant_id}>
											<td className="px-4 py-2">{v.variant_id}</td>
											<td className="px-4 py-2">{v.product_name}</td>
											<td className="px-4 py-2">{v.variant_name}</td>
											<td className="px-4 py-2 text-right">{v.views}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</ViewCard>

					<ViewCard title="Top variants bị report nhiều">
						<div className="overflow-x-auto">
							<table className="min-w-[500px] w-full text-left">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2">ID Phiên bản</th>
										<th className="px-4 py-2">Sản phẩm</th>
										<th className="px-4 py-2 text-right">Lượt report</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{topReportedVariants.map(v => (
										<tr key={v.variant_id}>
											<td className="px-4 py-2">{v.variant_id}</td>
											<td className="px-4 py-2">{v.product_name}</td>
											<td className="px-4 py-2 text-right">{v.report_count}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</ViewCard>
				</div>

				<div className="mt-4">
					<ViewCard title="Top users hoạt động (theo recent views)">
						<div className="overflow-x-auto">
							<table className="min-w-[500px] w-full text-left">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2">Người dùng</th>
										<th className="px-4 py-2">Tên đăng nhập</th>
										<th className="px-4 py-2 text-right">Lượt xem gần đây</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{topActiveUsers.map(u => (
										<tr key={u.user_id}>
											<td className="px-4 py-2">{u.user_id}</td>
											<td className="px-4 py-2">{u.username}</td>
											<td className="px-4 py-2 text-right">{u.recent_views}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</ViewCard>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;


