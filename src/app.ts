import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import taskRoutes from './routes/taskRoutes';
import blogRoutes from './routes/blogRoutes';
import advancedDashboardRoutes from './routes/advancedDashboardRoutes';
import { setupSwagger } from './swagger';
import path from 'path';

dotenv.config();

const allowedOrigins = [ process.env.ALLOWED_ORIGIN]

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}));

app.use(express.json());
setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shipment', shipmentRoutes); 
app.use('/api', inventoryRoutes);
app.use('/api', taskRoutes);
app.use('/api', blogRoutes);
app.use('/api', advancedDashboardRoutes);

app.use(express.static(path.join(__dirname, '../public')));

export default app;
