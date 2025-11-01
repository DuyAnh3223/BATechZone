import React from 'react';
import {useAuth} from '../../context/AuthContext';
import {useNavigate} from 'react-router';

const StatCard = ({label, value}) => (
	<div style={{border: '1px solid #e5e7eb', borderRadius: 8, padding: 16}}>
		<div style={{color: '#6b7280', fontSize: 12}}>{label}</div>
		<div style={{fontSize: 24, fontWeight: 700}}>{value}</div>
	</div>
);

const AdminDashboard = () => {
	const {user, logout} = useAuth();
	const navigate = useNavigate();

	return (
		<div style={{maxWidth: 1000, margin: '24px auto', padding: 16}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<h2>Admin Dashboard</h2>
				<div>
					<span style={{marginRight: 12}}>Xin chào, {user?.fullName || user?.username}</span>
					<button onClick={() => { logout(); navigate('/admin/login'); }}>Đăng xuất</button>
				</div>
			</div>

			<div style={{display: 'grid', gap: 16, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginTop: 24}}>
				<StatCard label="Đơn hàng hôm nay" value={12} />
				<StatCard label="Doanh thu (VNĐ)" value={new Intl.NumberFormat('vi-VN').format(125000000)} />
				<StatCard label="Khách hàng mới" value={5} />
				<StatCard label="Sản phẩm hết hàng" value={3} />
			</div>

			<div style={{marginTop: 24}}>
				<h3>Hoạt động gần đây</h3>
				<ul>
					<li>ORD-2024-003 đã được tạo</li>
					<li>Người dùng mới: john_doe_2</li>
					<li>Đã đăng bài: Top 10 SSD 2024</li>
				</ul>
			</div>
		</div>
	);
};

export default AdminDashboard;


