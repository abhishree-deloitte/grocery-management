import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getOrdersByDate,
  getStockBySupplier,
  getCriticalAlerts,
  getRestockTrends,
  getInventoryFinancials
} from '../controllers/advancedDashboardController';

const router = Router();

router.get('/dashboard/insights/orders-by-date', authenticateJWT, getOrdersByDate);
router.get('/dashboard/insights/stock-by-supplier', authenticateJWT, getStockBySupplier);
router.get('/dashboard/alerts', authenticateJWT, getCriticalAlerts);
router.get('/dashboard/trends/restocks', authenticateJWT, getRestockTrends);
router.get('/dashboard/financials', authenticateJWT, getInventoryFinancials);

export default router;
