import React from 'react';
import {Navigate, Outlet} from 'react-router';
import { useUserAuthStore } from '@/stores/useUserAuthStore';

const ProtectedRoute = ({requireAdmin = false, redirectTo = '/login'}) => {
	const user = useUserAuthStore((state) => state.user);
	const isAuthenticated = !!user;
	const isAdmin = user?.role === 2;
	
	if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
	if (requireAdmin && !isAdmin) return <Navigate to={redirectTo} replace />;
	return <Outlet />;
};

export default ProtectedRoute;


