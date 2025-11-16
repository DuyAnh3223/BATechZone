import React from 'react';

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

const roleClass = (role) =>
  role === 2 || role === 'admin' ? 'bg-pink-100 text-pink-700' :
  role === 1 || role === 'shipper' ? 'bg-yellow-100 text-yellow-700' :
  'bg-blue-100 text-blue-700';

const AdminUserItem = ({ user, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-blue-50 transition">
      <td className="px-4 py-3 font-medium text-gray-800">{user.user_id}</td>
      <td className="px-4 py-3">{user.username}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{user.full_name || '-'}</td>
      <td className="px-4 py-3">{user.phone || '-'}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${roleClass(user.role)}`}>
          {user.role === 0 ? 'Khách hàng' : user.role === 1 ? 'Người giao hàng' : 'Quản trị viên'}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {user.is_active ? (
          <span className="text-green-600 font-bold">Kích hoạt</span>
        ) : (
          <span className="text-gray-400 font-bold">Vô hiệu</span>
        )}
      </td>
      <td className="px-4 py-3">{formatDate(user.created_at)}</td>
      <td className="px-4 py-3">{formatDate(user.updated_at)}</td>
      <td className="px-4 py-3 flex gap-2">
        <button 
          onClick={() => onEdit && onEdit(user)}
          className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          Chỉnh sửa
        </button>
        <button 
          onClick={() => onDelete && onDelete(user)}
          className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default AdminUserItem;

