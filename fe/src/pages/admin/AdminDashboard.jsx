import React, { useMemo, useState, useEffect } from 'react';
import { Users, Box, DollarSign, Eye, TrendingUp, ShoppingCart, Clock, CheckCircle, Truck, XCircle, Package, AlertCircle } from "lucide-react";
import useDashboardStore from '@/stores/useDashboardStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Line chart for revenue overview
const LineChart = ({data, revenueData = [], startDate, endDate}) => {
	if (!revenueData || revenueData.length === 0) {
		return (
			<div className="w-full h-60 flex items-center justify-center bg-white rounded-xl shadow p-4">
				<p className="text-gray-500">Không có dữ liệu doanh thu</p>
			</div>
		);
	}

	const chartHeight = 500;
	const chartWidth = 1600;
	const paddingLeft = 80;
	const paddingRight = 20;
	const paddingTop = 20;
	const paddingBottom = 50;
	const plotWidth = chartWidth - paddingLeft - paddingRight;
	const plotHeight = chartHeight - paddingTop - paddingBottom;
	
	// Fixed Y-axis max at 90 million
	const yAxisMax = 90000000;
	const yAxisSteps = 9; // 0, 10, 20, 30, 40, 50, 60, 70, 80, 90 triệu
	
	// Use filter dates instead of data dates
	// Parse dates carefully to avoid timezone issues
	const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
	const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
	const minDate = new Date(startYear, startMonth - 1, startDay);
	const maxDate = new Date(endYear, endMonth - 1, endDay);
	
	// Generate all dates in the range
	const allDates = [];
	const revenueMap = {};
	
	// Create map of existing revenue data
	revenueData.forEach(item => {
		const dateKey = new Date(item.date).toISOString().split('T')[0];
		revenueMap[dateKey] = {
			revenue: parseFloat(item.revenue),
			order_count: item.order_count
		};
	});
	
	// Generate complete date range using filter dates
	const currentDate = new Date(startYear, startMonth - 1, startDay);
	
	while (currentDate <= maxDate) {
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');
		const day = String(currentDate.getDate()).padStart(2, '0');
		const dateKey = `${year}-${month}-${day}`;
		
		allDates.push({
			date: dateKey,
			revenue: revenueMap[dateKey]?.revenue || 0,
			order_count: revenueMap[dateKey]?.order_count || 0
		});
		currentDate.setDate(currentDate.getDate() + 1);
	}
	
	// Check if we have enough data points
	if (allDates.length < 2) {
		return (
			<div className="w-full h-60 flex items-center justify-center bg-white rounded-xl shadow p-4">
				<p className="text-gray-500">Cần ít nhất 2 ngày để hiển thị biểu đồ</p>
			</div>
		);
	}
	
	// Calculate points for the line
	const points = allDates.map((item, index) => {
		const x = paddingLeft + (index / (allDates.length - 1)) * plotWidth;
		const normalizedValue = item.revenue / yAxisMax;
		const y = paddingTop + plotHeight - (normalizedValue * plotHeight);
		return { x, y, index, ...item };
	});
	
	// Create path for the line
	const linePath = points.map((p, i) => 
		`${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
	).join(' ');
	
	// Create area path for gradient fill
	const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${paddingLeft} ${paddingTop + plotHeight} Z`;

	// Format date to show day/month
	const formatShortDate = (dateStr) => {
		const date = new Date(dateStr);
		return `${date.getDate()}/${date.getMonth() + 1}`;
	};

	return (
		<div className="w-full bg-white rounded-xl shadow p-6 overflow-x-auto">
			<svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
				{/* Horizontal grid lines (Y-axis) */}
				{Array.from({ length: yAxisSteps + 1 }).map((_, i) => {
					const ratio = i / yAxisSteps;
					const y = paddingTop + plotHeight * (1 - ratio);
					const value = (yAxisMax * ratio);
					
					return (
						<g key={i}>
							<line
								x1={paddingLeft}
								y1={y}
								x2={chartWidth - paddingRight}
								y2={y}
								stroke="#e5e7eb"
								strokeWidth="1"
								strokeDasharray={i === 0 ? "0" : "4 4"}
							/>
							<text
								x={paddingLeft - 10}
								y={y + 4}
								textAnchor="end"
								className="text-xs fill-gray-500"
								fontSize="11"
							>
								{(value / 1000000).toFixed(0)}tr
							</text>
						</g>
					);
				})}
				
				{/* Vertical grid lines (one per day) */}
				{allDates.map((item, i) => {
					const x = paddingLeft + (i / (allDates.length - 1)) * plotWidth;
					return (
						<line
							key={`vline-${i}`}
							x1={x}
							y1={paddingTop}
							x2={x}
							y2={paddingTop + plotHeight}
							stroke="#f3f4f6"
							strokeWidth="1"
						/>
					);
				})}
				
				{/* X-axis */}
				<line
					x1={paddingLeft}
					y1={paddingTop + plotHeight}
					x2={chartWidth - paddingRight}
					y2={paddingTop + plotHeight}
					stroke="#9ca3af"
					strokeWidth="2"
				/>
				
				{/* Y-axis */}
				<line
					x1={paddingLeft}
					y1={paddingTop}
					x2={paddingLeft}
					y2={paddingTop + plotHeight}
					stroke="#9ca3af"
					strokeWidth="2"
				/>
				
				{/* Area gradient fill */}
				<defs>
					<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
						<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
					</linearGradient>
				</defs>
				<path d={areaPath} fill="url(#areaGradient)" />
				
				{/* Line */}
				<path
					d={linePath}
					fill="none"
					stroke="#3b82f6"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				
				{/* Data points - show all points */}
				{points.map((point, i) => (
					<g key={i} className="group cursor-pointer">
						{/* Invisible larger circle for easier hovering */}
						<circle
							cx={point.x}
							cy={point.y}
							r="12"
							fill="transparent"
						/>
						{/* Always show visible point */}
						<circle
							cx={point.x}
							cy={point.y}
							r="5"
							fill={point.revenue > 0 ? "#3b82f6" : "#93c5fd"}
							stroke="white"
							strokeWidth="2"
							className="transition-all"
						/>
						{/* Hover highlight */}
						<circle
							cx={point.x}
							cy={point.y}
							r="8"
							fill="white"
							stroke="#3b82f6"
							strokeWidth="3"
							className="opacity-0 group-hover:opacity-100 transition-opacity"
						/>
						{/* Tooltip on hover - show for all points */}
						<g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
							<rect
								x={point.x - 60}
								y={point.y - 55}
								width="120"
								height="45"
								rx="4"
								fill="#1f2937"
							/>
							<text
								x={point.x}
								y={point.y - 35}
								textAnchor="middle"
								className="fill-gray-300 text-xs"
								fontSize="10"
							>
								{formatShortDate(point.date)}
							</text>
							<text
								x={point.x}
								y={point.y - 22}
								textAnchor="middle"
								className="fill-white text-xs font-semibold"
								fontSize="11"
							>
								{formatCurrency(point.revenue)}
							</text>
							<text
								x={point.x}
								y={point.y - 12}
								textAnchor="middle"
								className="fill-gray-400 text-xs"
								fontSize="9"
							>
								{point.order_count} đơn
							</text>
						</g>
					</g>
				))}
				
				{/* X-axis labels (dates) - show every nth day to avoid overlap */}
				{allDates.map((item, i) => {
					const x = paddingLeft + (i / (allDates.length - 1)) * plotWidth;
					const showLabel = i === 0 || i === allDates.length - 1 || i % Math.ceil(allDates.length / 15) === 0;
					
					return showLabel ? (
						<text
							key={i}
							x={x}
							y={paddingTop + plotHeight + 20}
							textAnchor="middle"
							className="text-xs fill-gray-600"
							fontSize="10"
						>
							{formatShortDate(item.date)}
						</text>
					) : null;
				})}
			</svg>
		</div>
	);
};

// Multi segment pie using SVG for interactive hover
const PieMulti = ({segments}) => {
	const total = segments.reduce((t, s) => t + s.value, 0) || 1;
	const size = 160; // 40 * 4 = 160px
	const center = size / 2;
	const radius = size / 2;
	
	let currentAngle = -90; // Start from top
	
	const createArc = (startAngle, endAngle) => {
		const startRad = (startAngle * Math.PI) / 180;
		const endRad = (endAngle * Math.PI) / 180;
		
		const x1 = center + radius * Math.cos(startRad);
		const y1 = center + radius * Math.sin(startRad);
		const x2 = center + radius * Math.cos(endRad);
		const y2 = center + radius * Math.sin(endRad);
		
		const largeArc = endAngle - startAngle > 180 ? 1 : 0;
		
		return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
	};
	
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-full">
			{segments.map((segment, idx) => {
				const angle = (segment.value / total) * 360;
				const startAngle = currentAngle;
				const endAngle = currentAngle + angle;
				currentAngle = endAngle;
				
				return (
					<path
						key={idx}
						d={createArc(startAngle, endAngle)}
						fill={segment.color}
						className="transition-transform duration-200 hover:scale-110 origin-center cursor-pointer"
						style={{transformOrigin: `${center}px ${center}px`}}
					/>
				);
			})}
		</svg>
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
	// Format helper functions
	const formatToInputDate = (dateStr) => {
		// Convert yyyy-mm-dd to dd/mm/yyyy
		const [year, month, day] = dateStr.split('-');
		return `${day}/${month}/${year}`;
	};
	
	const parseInputDate = (displayStr) => {
		// Convert dd/mm/yyyy to yyyy-mm-dd
		const [day, month, year] = displayStr.split('/');
		return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	};

	// Validate date
	const validateDate = (dateStr) => {
		if (!dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
			return { valid: false, message: 'Định dạng ngày phải là dd/mm/yyyy' };
		}
		
		const [day, month, year] = dateStr.split('/').map(Number);
		
		// Check for negative numbers
		if (day < 0 || month < 0 || year < 0) {
			return { valid: false, message: 'Ngày tháng năm không được âm' };
		}
		
		// Check year
		if (year < 1900 || year > 2100) {
			return { valid: false, message: 'Năm phải từ 1900 đến 2100' };
		}
		
		// Check month
		if (month < 1 || month > 12) {
			return { valid: false, message: 'Tháng phải từ 01 đến 12' };
		}
		
		// Check day
		const daysInMonth = new Date(year, month, 0).getDate();
		if (day < 1 || day > daysInMonth) {
			return { valid: false, message: `Ngày không hợp lệ. Tháng ${month}/${year} chỉ có ${daysInMonth} ngày` };
		}
		
		// Check if date is valid
		const testDate = new Date(year, month - 1, day);
		if (testDate.getDate() !== day || testDate.getMonth() !== month - 1 || testDate.getFullYear() !== year) {
			return { valid: false, message: 'Ngày tháng năm không hợp lệ' };
		}
		
		return { valid: true };
	};

	const [errorPopup, setErrorPopup] = useState({ show: false, message: '', inputType: null, invalidValue: null });

	// Auto-correct invalid date
	const autoCorrectDate = (dateStr) => {
		if (!dateStr || dateStr.length !== 10) return dateStr;
		
		try {
			let [day, month, year] = dateStr.split('/').map(str => parseInt(str) || 1);
			
			// Correct year
			if (year < 1900) year = 1900;
			if (year > 2100) year = 2100;
			
			// Correct month
			if (month < 1) month = 1;
			if (month > 12) month = 12;
			
			// Correct day based on month
			const daysInMonth = new Date(year, month, 0).getDate();
			if (day < 1) day = 1;
			if (day > daysInMonth) day = daysInMonth;
			
			// Format back to dd/mm/yyyy
			return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
		} catch (err) {
			return dateStr;
		}
	};

	const handleCloseErrorPopup = () => {
		if (errorPopup.inputType && errorPopup.invalidValue) {
			const correctedDate = autoCorrectDate(errorPopup.invalidValue);
			
			if (errorPopup.inputType === 'start') {
				setStartDisplay(correctedDate);
				// Also update internal state
				try {
					const parsed = parseInputDate(correctedDate);
					if (parsed.match(/^\d{4}-\d{2}-\d{2}$/)) {
						setStart(parsed);
					}
				} catch (err) {
					// Keep old value
				}
			} else if (errorPopup.inputType === 'end') {
				setEndDisplay(correctedDate);
				// Also update internal state
				try {
					const parsed = parseInputDate(correctedDate);
					if (parsed.match(/^\d{4}-\d{2}-\d{2}$/)) {
						setEnd(parsed);
					}
				} catch (err) {
					// Keep old value
				}
			}
		}
		setErrorPopup({ show: false, message: '', inputType: null, invalidValue: null });
	};

	const getMonthRange = (year, month) => {
		// month is 0-indexed (0 = January, 11 = December)
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0); // Day 0 of next month = last day of current month
		return {
			start: firstDay.toISOString().split('T')[0],
			end: lastDay.toISOString().split('T')[0]
		};
	};

	const [start, setStart] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		return date.toISOString().split('T')[0];
	});
	const [end, setEnd] = useState(() => new Date().toISOString().split('T')[0]);
	
	const [startDisplay, setStartDisplay] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		return formatToInputDate(date.toISOString().split('T')[0]);
	});
	const [endDisplay, setEndDisplay] = useState(() => formatToInputDate(new Date().toISOString().split('T')[0]));

	const handleStartChange = (e) => {
		const value = e.target.value;
		setStartDisplay(value);
		// Only parse if value has correct format (dd/mm/yyyy)
		if (value.length === 10) {
			const validation = validateDate(value);
			if (!validation.valid) {
				setErrorPopup({ show: true, message: validation.message, inputType: 'start', invalidValue: value });
				return;
			}
			try {
				const parsed = parseInputDate(value);
				if (parsed.match(/^\d{4}-\d{2}-\d{2}$/)) {
					// Check if start date is after end date
					if (end && parsed > end) {
						setErrorPopup({ 
							show: true, 
							message: 'Ngày bắt đầu không được sau ngày kết thúc', 
							inputType: 'start', 
							invalidValue: value 
						});
						return;
					}
					setStart(parsed);
				}
			} catch (err) {
				setErrorPopup({ show: true, message: 'Ngày không hợp lệ', inputType: 'start', invalidValue: value });
			}
		}
	};

	const handleEndChange = (e) => {
		const value = e.target.value;
		setEndDisplay(value);
		// Only parse if value has correct format (dd/mm/yyyy)
		if (value.length === 10) {
			const validation = validateDate(value);
			if (!validation.valid) {
				setErrorPopup({ show: true, message: validation.message, inputType: 'end', invalidValue: value });
				return;
			}
			try {
				const parsed = parseInputDate(value);
				if (parsed.match(/^\d{4}-\d{2}-\d{2}$/)) {
					// Check if end date is before start date
					if (start && parsed < start) {
						setErrorPopup({ 
							show: true, 
							message: 'Ngày kết thúc không được trước ngày bắt đầu', 
							inputType: 'end', 
							invalidValue: value 
						});
						return;
					}
					setEnd(parsed);
				}
			} catch (err) {
				setErrorPopup({ show: true, message: 'Ngày không hợp lệ', inputType: 'end', invalidValue: value });
			}
		}
	};

	const {
		summary,
		recentOrders,
		topSelling,
		orderStatusDistribution,
		categoryDistribution,
		revenueData,
		topViewed,
		topUsers,
		loading,
		fetchAllDashboardData
	} = useDashboardStore();

	useEffect(() => {
		fetchAllDashboardData(start, end);
	}, []);

	const handleFilter = () => {
		// Validate date range before filtering
		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			
			if (startDate > endDate) {
				setErrorPopup({ 
					show: true, 
					message: 'Ngày bắt đầu không được sau ngày kết thúc. Vui lòng kiểm tra lại khoảng thời gian.', 
					inputType: null, 
					invalidValue: null 
				});
				return;
			}
		}
		fetchAllDashboardData(start, end);
	};

	const handleThisMonth = () => {
		const now = new Date();
		const { start: startDate, end: endDate } = getMonthRange(now.getFullYear(), now.getMonth());
		setStart(startDate);
		setEnd(endDate);
		setStartDisplay(formatToInputDate(startDate));
		setEndDisplay(formatToInputDate(endDate));
	};

	const handleLastMonth = () => {
		const now = new Date();
		const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
		const { start: startDate, end: endDate } = getMonthRange(lastMonth.getFullYear(), lastMonth.getMonth());
		setStart(startDate);
		setEnd(endDate);
		setStartDisplay(formatToInputDate(startDate));
		setEndDisplay(formatToInputDate(endDate));
	};

	// Map order status to Vietnamese
	const getStatusLabel = (status) => {
		const statusMap = {
			pending: 'Chờ xử lý',
			confirmed: 'Đã xác nhận',
			shipping: 'Đang giao',
			delivered: 'Hoàn thành',
			cancelled: 'Đã hủy'
		};
		return statusMap[status] || status;
	};

	// Get status badge variant
	const getStatusBadge = (status) => {
		const config = {
			pending: { variant: 'warning', icon: <Clock className="w-3 h-3" /> },
			confirmed: { variant: 'default', icon: <Package className="w-3 h-3" /> },
			shipping: { variant: 'info', icon: <Truck className="w-3 h-3" /> },
			delivered: { variant: 'success', icon: <CheckCircle className="w-3 h-3" /> },
			cancelled: { variant: 'destructive', icon: <XCircle className="w-3 h-3" /> }
		};
		const cfg = config[status] || { variant: 'default', icon: null };
		return (
			<Badge variant={cfg.variant} className="flex items-center gap-1">
				{cfg.icon}
				{getStatusLabel(status)}
			</Badge>
		);
	};

	// Map payment method to Vietnamese
	const getPaymentMethodLabel = (method) => {
		const methodMap = {
			cod: 'COD',
			bank_transfer: 'Chuyển khoản',
			credit_card: 'Thẻ tín dụng',
			momo: 'MoMo',
			vnpay: 'VNPay',
			payos: 'PayOS'
		};
		return methodMap[method] || method;
	};

	// Prepare status segments for pie chart
	const statusSegments = useMemo(() => {
		const colorMap = {
			delivered: '#16a34a',
			cancelled: '#ef4444',
			shipping: '#2563eb',
			confirmed: '#8b5cf6',
			pending: '#f59e0b'
		};
		
		return (orderStatusDistribution || [])
			.map(item => ({
				label: getStatusLabel(item.status),
				value: item.count,
				color: colorMap[item.status] || '#6b7280'
			}))
			.sort((a, b) => b.value - a.value); // Sắp xếp giảm dần
	}, [orderStatusDistribution]);

	// Prepare category segments for pie chart
	const categorySegments = useMemo(() => {
		const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
		
		return (categoryDistribution || [])
			.map((item, index) => ({
				label: item.category_name,
				value: item.product_count,
				color: colors[index % colors.length]
			}))
			.sort((a, b) => b.value - a.value); // Sắp xếp giảm dần
	}, [categoryDistribution]);

	// Process revenue data for bar chart
	const barData = useMemo(() => {
		if (!revenueData || revenueData.length === 0) {
			return [0.1, 0.2, 0.3, 0.4, 0.5]; // Default placeholder
		}
		
		const maxRevenue = Math.max(...revenueData.map(d => parseFloat(d.revenue)));
		return revenueData.map(d => maxRevenue > 0 ? parseFloat(d.revenue) / maxRevenue : 0);
	}, [revenueData]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Error Dialog */}
			<Dialog open={errorPopup.show} onOpenChange={(open) => {
				if (!open) {
				handleCloseErrorPopup();
			}
		}}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center justify-center mb-4">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<AlertCircle className="w-10 h-10 text-red-600" />
						</div>
					</div>
					<DialogTitle className="text-center text-xl">Lỗi ngày tháng</DialogTitle>
					<DialogDescription className="text-center text-base mt-2">
						{errorPopup.message}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-center">
					<Button
						type="button"
						onClick={handleCloseErrorPopup}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						Đóng
					</Button>
				</DialogFooter>
				</DialogContent>
			</Dialog>

			<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Trang quản trị BATechZone</h1>

			{/* Tổng quan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card 
					title="Tổng người dùng" 
					value={summary?.users || 0} 
					icon={<Users className="size-6"/>} 
					accentClass="bg-blue-50 text-blue-600" 
				/>
                <Card 
					title="Tổng sản phẩm" 
					value={summary?.products || 0} 
					icon={<Box className="size-6"/>} 
					accentClass="bg-violet-50 text-violet-600" 
				/>
                <Card 
					title="Doanh thu" 
					value={formatCurrency(summary?.revenue || 0)} 
					icon={<DollarSign className="size-6"/>} 
					accentClass="bg-emerald-50 text-emerald-600" 
				/>
                <Card 
					title="Tổng đơn hàng" 
					value={summary?.orders || 0} 
					icon={<ShoppingCart className="size-6"/>} 
					accentClass="bg-amber-50 text-amber-600" 
				/>
            </div>

			{/* Tổng quan đơn hàng (Biểu đồ cột) với chọn thời gian */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<div className="text-lg font-semibold">Tổng quan đơn hàng</div>
					<div className="flex flex-wrap items-center gap-2 text-sm">
						<div className="flex items-center gap-2">
							<button onClick={handleLastMonth} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium transition-colors text-sm">
								Tháng trước
							</button>
							<button onClick={handleThisMonth} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium transition-colors text-sm">
								Tháng này
							</button>
						</div>
						<div className="h-6 w-px bg-gray-300"></div>
						<div className="flex items-center gap-1">
							<span className="text-gray-600">Từ:</span>
							<input 
								type="text" 
								value={startDisplay} 
								onChange={handleStartChange}
								className="border rounded px-3 py-1.5 w-32"
								placeholder="dd/mm/yyyy"
								pattern="\d{2}/\d{2}/\d{4}"
							/>
						</div>
						<span className="text-gray-400">—</span>
						<div className="flex items-center gap-1">
							<span className="text-gray-600">Đến:</span>
							<input 
								type="text" 
								value={endDisplay} 
								onChange={handleEndChange}
								className="border rounded px-3 py-1.5 w-32"
								placeholder="dd/mm/yyyy"
								pattern="\d{2}/\d{2}/\d{4}"
							/>
						</div>
						<button onClick={handleFilter} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors">
							Lọc
						</button>
					</div>
				</div>
				<LineChart data={barData} revenueData={revenueData} startDate={start} endDate={end} />
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
				<div className="bg-white rounded-xl shadow p-5">
					<div className="flex items-center gap-2 mb-3">
						<ShoppingCart className="w-5 h-5 text-blue-600" />
						<div className="text-lg font-semibold">Đơn hàng gần đây</div>
					</div>
					{recentOrders && recentOrders.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-[400px] w-full text-left text-sm">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2">Mã ĐH</th>
										<th className="px-4 py-2">Tên người nhận</th>
										<th className="px-4 py-2 text-right">Tổng tiền</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{recentOrders.map(o => (
										<tr key={o.order_id} className="hover:bg-gray-50 transition-colors">
											<td className="px-4 py-2 font-mono text-blue-600">#{o.order_id}</td>
											<td className="px-4 py-2">{o.customer_name}</td>
											<td className="px-4 py-2 text-right font-semibold">{formatCurrency(o.total_amount)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="text-center py-12">
							<ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
							<p className="text-gray-500">Chưa có đơn hàng nào</p>
						</div>
					)}
				</div>

				<div className="bg-white rounded-xl shadow p-5">
					<div className="flex items-center gap-2 mb-3">
						<TrendingUp className="w-5 h-5 text-emerald-600" />
						<div className="text-lg font-semibold">Sản phẩm bán chạy</div>
					</div>
					{topSelling && topSelling.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-[700px] w-full text-left text-sm">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2">Sản phẩm</th>
										<th className="px-4 py-2">Danh mục</th>
										<th className="px-4 py-2 text-right">Đã bán</th>
										<th className="px-4 py-2 text-right">Giá</th>

									</tr>
								</thead>
								<tbody className="divide-y">
									{topSelling.map((p, idx) => (
										<tr key={p.product_id} className="hover:bg-gray-50 transition-colors">
											<td className="px-4 py-2">
												<div className="flex items-center gap-2">
													{idx < 3 && <TrendingUp className="w-4 h-4 text-amber-500" />}
													<span>{p.product_name}</span>
												</div>
											</td>
											<td className="px-4 py-2">
												<Badge variant="outline">{p.category_name || 'N/A'}</Badge>
											</td>
											<td className="px-4 py-2 text-right font-semibold text-emerald-600">{p.total_sold}</td>
											<td className="px-4 py-2 text-right">{formatCurrency(p.price)}</td>

										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="text-center py-12">
							<Box className="w-12 h-12 text-gray-300 mx-auto mb-2" />
							<p className="text-gray-500">Chưa có dữ liệu bán hàng</p>
						</div>
					)}
				</div>
			</div>

			{/* Top Users Section */}
			<ViewCard title="Top người dùng hoạt động">
				{topUsers && topUsers.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-[500px] w-full text-left text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-2">Người dùng</th>
									<th className="px-4 py-2">Tên đầy đủ</th>
									<th className="px-4 py-2 text-right">Lượt xem</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{topUsers.map(u => (
									<tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
										<td className="px-4 py-2">
											<div className="flex items-center gap-2">
												<Users className="w-4 h-4 text-blue-500" />
												<span className="font-mono text-blue-600">@{u.username}</span>
											</div>
										</td>
										<td className="px-4 py-2">{u.full_name || 'N/A'}</td>
										<td className="px-4 py-2 text-right font-semibold text-green-600">{u.recent_views}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
						<p className="text-gray-500">Chưa có dữ liệu người dùng</p>
					</div>
				)}
			</ViewCard>
		</div>
	);
};

export default AdminDashboard;


