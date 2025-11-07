import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import routes from './routes/index.js';
import adminUserRoute from './routes/adminUserRoute.js';
import adminProductRoute from './routes/adminProductRoute.js';
import adminVariantRoute from './routes/adminVariantRoute.js';
import adminCouponRoute from './routes/adminCouponRoute.js';
import adminCategoryRoute from './routes/adminCategoryRoute.js';

// resolve __dirname in ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to PC Hardware Store API',
        timestamp: new Date(),
        version: '1.0.0'
    });
});

//public routes
app.use('/api/auth', authRoute);

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

//admin routes
app.use('/api/admin', adminUserRoute);
app.use('/api/admin', adminProductRoute);
app.use('/api/admin', adminVariantRoute);
app.use('/api/admin', adminCouponRoute);
app.use('/api/admin', adminCategoryRoute);

//private routes
app.use('/api', routes);

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Database connection and server start
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
