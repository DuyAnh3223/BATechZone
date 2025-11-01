import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserRoutes from './routes/UserRoutes';
import { testConnection } from './services/api';

function App() {
  useEffect(() => {
    // Test backend connection when app starts
    const checkBackendConnection = async () => {
      const isConnected = await testConnection();
      if (isConnected) {
        toast.success('Kết nối backend thành công!');
      } else {
        toast.error('Không thể kết nối tới backend!');
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <UserRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
