import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate JWT tokens for multi-session support
 * @param {Object} user - User object from database
 * @param {string} sessionType - 'admin' or 'user'
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokens = (user, sessionType) => {
    if (!['admin', 'user'].includes(sessionType)) {
        throw new Error('Invalid session type. Must be "admin" or "user"');
    }

    // Validate user object
    if (!user || !user.user_id || !user.username || user.role === undefined) {
        throw new Error('Invalid user object');
    }

    // Ensure admin session is only for role 2
    if (sessionType === 'admin' && user.role !== 2) {
        throw new Error('Admin session requires role 2');
    }

    // Ensure user session is not for role 2
    if (sessionType === 'user' && user.role === 2) {
        throw new Error('User session cannot be used for admin role');
    }

    const payload = {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        sessionType, // 'admin' or 'user' - key để phân biệt sessions
    };

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    // Generate refresh token with different secret based on session type
    const refreshSecret = sessionType === 'admin'
        ? process.env.JWT_ADMIN_REFRESH_SECRET
        : process.env.JWT_USER_REFRESH_SECRET;

    const refreshToken = jwt.sign(
        payload,
        refreshSecret,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
    try {
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Access token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid access token');
        }
        throw error;
    }
};

/**
 * Verify admin refresh token
 * @param {string} token - JWT admin refresh token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyAdminRefreshToken = (token) => {
    try {
        if (!token) {
            throw new Error('No refresh token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_REFRESH_SECRET);

        // Validate session type
        if (decoded.sessionType !== 'admin') {
            throw new Error('Invalid session type for admin refresh token');
        }

        // Validate role
        if (decoded.role !== 2) {
            throw new Error('Invalid role for admin refresh token');
        }

        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Admin refresh token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid admin refresh token');
        }
        throw error;
    }
};

/**
 * Verify user refresh token
 * @param {string} token - JWT user refresh token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyUserRefreshToken = (token) => {
    try {
        if (!token) {
            throw new Error('No refresh token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_USER_REFRESH_SECRET);

        // Validate session type
        if (decoded.sessionType !== 'user') {
            throw new Error('Invalid session type for user refresh token');
        }

        // Validate role (user should not be admin)
        if (decoded.role === 2) {
            throw new Error('Invalid role for user refresh token');
        }

        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('User refresh token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid user refresh token');
        }
        throw error;
    }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) return null;

    // Format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
};

/**
 * Generate new access token from refresh token
 * @param {string} refreshToken - Refresh token
 * @param {string} sessionType - 'admin' or 'user'
 * @returns {string} New access token
 */
export const refreshAccessToken = (refreshToken, sessionType) => {
    try {
        // Verify refresh token based on session type
        let decoded;
        if (sessionType === 'admin') {
            decoded = verifyAdminRefreshToken(refreshToken);
        } else if (sessionType === 'user') {
            decoded = verifyUserRefreshToken(refreshToken);
        } else {
            throw new Error('Invalid session type');
        }

        // Generate new access token with same payload (excluding iat, exp)
        const payload = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            sessionType: decoded.sessionType,
        };

        const newAccessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
        );

        return newAccessToken;
    } catch (error) {
        throw error;
    }
};

/**
 * Validate JWT environment variables
 * @throws {Error} If required env vars are missing
 */
export const validateJWTConfig = () => {
    const required = [
        'JWT_ACCESS_SECRET',
        'JWT_ADMIN_REFRESH_SECRET',
        'JWT_USER_REFRESH_SECRET',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required JWT environment variables: ${missing.join(', ')}`);
    }

    // Validate secret lengths (minimum 32 characters recommended)
    const secrets = {
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ADMIN_REFRESH_SECRET: process.env.JWT_ADMIN_REFRESH_SECRET,
        JWT_USER_REFRESH_SECRET: process.env.JWT_USER_REFRESH_SECRET,
    };

    Object.entries(secrets).forEach(([key, value]) => {
        if (value.length < 32) {
            console.warn(`Warning: ${key} should be at least 32 characters long for security`);
        }
    });
};
