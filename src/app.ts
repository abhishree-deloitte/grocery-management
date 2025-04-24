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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shipment', shipmentRoutes); 
app.use('/api', inventoryRoutes);
app.use('/api', taskRoutes);
app.use('/api', blogRoutes);

export default app;
