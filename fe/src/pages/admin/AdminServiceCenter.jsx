import React, { useState } from 'react';
import AdminWarranty from './AdminWarranty';
import AdminServiceRequest from './AdminServiceRequest';

const Tab = ({active, onClick, children}) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{children}</button>
);

const AdminServiceCenter = () => {
  const [tab, setTab] = useState('warranty');
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Service Center</h1>
      </div>
      <div className="flex gap-2 mb-6">
        <Tab active={tab==='warranty'} onClick={()=>setTab('warranty')}>Warranty</Tab>
        <Tab active={tab==='requests'} onClick={()=>setTab('requests')}>Service Requests</Tab>
      </div>
      {tab==='warranty' ? <AdminWarranty /> : <AdminServiceRequest />}
    </section>
  );
};

export default AdminServiceCenter;
