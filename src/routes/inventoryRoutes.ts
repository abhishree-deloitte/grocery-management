import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  addStock,
  getStockDetails,
  getInventorySummary,
  getOrderGraph,
  getNewStock,
} from "../controllers/inventoryController";

const router = Router();

router.post("/inventory", authenticateJWT, addStock);
router.get("/stockDetails", authenticateJWT, getStockDetails);
router.get("/inventory/summary", authenticateJWT, getInventorySummary);
router.get("/inventory/orders", authenticateJWT, getOrderGraph);
router.get("/inventory/newStock", authenticateJWT, getNewStock);
export default router;
