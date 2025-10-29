import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'batech_auth_v1';

export function AuthProvider({children}) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(AUTH_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setUser(parsed);
			}
		} catch (e) {
			console.error('Failed to load auth from storage', e);
		}
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	}, [user]);

	const login = async ({emailOrUsername, password, role = 'customer'}) => {
		// Placeholder client-only auth. Replace with real API call.
		if (!emailOrUsername || !password) {
			throw new Error('Vui lòng nhập đầy đủ thông tin');
		}
		const fakeUser = {
			id: 1,
			username: emailOrUsername,
			role,
			fullName: role === 'admin' ? 'Administrator' : 'Customer',
		};
		setUser(fakeUser);
		return fakeUser;
	};

	const register = async ({username, email, password}) => {
		if (!username || !email || !password) {
			throw new Error('Vui lòng nhập đầy đủ thông tin');
		}
		const newUser = {id: Date.now(), username, email, role: 'customer'};
		setUser(newUser);
		return newUser;
	};

	const logout = () => setUser(null);

	const value = useMemo(() => ({
		user,
		isAuthenticated: !!user,
		isAdmin: user?.role === 'admin',
		login,
		register,
		logout,
	}), [user]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}


