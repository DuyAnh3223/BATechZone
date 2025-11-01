import React from 'react';
import {Navigate, Outlet} from 'react-router';
import {useAuth} from '../context/AuthContext';

const ProtectedRoute = ({requireAdmin = false, redirectTo = '/login'}) => {
	const {isAuthenticated, isAdmin} = useAuth();
	if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
	if (requireAdmin && !isAdmin) return <Navigate to={redirectTo} replace />;
	return <Outlet />;
};

export default ProtectedRoute;


