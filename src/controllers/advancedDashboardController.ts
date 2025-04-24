import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { format, startOfDay } from "date-fns";

const prisma = new PrismaClient();

// 1. Orders grouped by date (StockEntry)
export const getOrdersByDate = async (req: Request, res: Response) => {
  try {
    const entries = await prisma.stockEntry.findMany({
      orderBy: { dateAdded: "asc" },
    });

    const grouped: Record<string, number> = {};
    entries.forEach((entry) => {
      const key = format(startOfDay(entry.dateAdded), "yyyy-MM-dd");
      grouped[key] = (grouped[key] || 0) + entry.quantity;
    });

    const formatted = Object.entries(grouped).map(([date, totalOrders]) => ({
      date,
      totalOrders,
    }));

    res.json({ status: 200, data: formatted });
  } catch (err) {
    res.status(500).json({ error: "Error getting order breakdown", details: err });
  }
};

// 2. Stock grouped by supplier
export const getStockBySupplier = async (req: Request, res: Response) => {
  try {
    const data = await prisma.product.findMany({
      include: {
        supplier: true,
        stock: true,
      },
    });

    const grouped = data.reduce((acc, product) => {
      const key = product.supplier.name;
      const stockQty = product.stock?.reduce((sum, stock) => sum + stock.totalQty, 0) || 0;
      acc[key] = (acc[key] || 0) + stockQty;
      return acc;
    }, {} as Record<string, number>);

    res.json({ status: 200, data: grouped });
  } catch (err) {
    res.status(500).json({ error: "Error grouping stock by supplier", details: err });
  }
};

// 3. Alerts: low stock and delayed shipments
export const getCriticalAlerts = async (req: Request, res: Response) => {
  try {
    const lowStock = await prisma.stockEntry.findMany({ where: { status: "Low" } });
    const delayedShipments = await prisma.shipment.findMany({
      where: {
        deliveryDate: { lt: new Date() },
        shipmentStatus: { not: "Completed" },
      },
    });

    res.json({
      status: 200,
      data: {
        lowStock,
        delayedShipments,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error getting alerts", details: err });
  }
};

// 4. Restock trends
export const getRestockTrends = async (req: Request, res: Response) => {
  try {
    const products = await prisma.stockEntry.groupBy({
      by: ["stockId"],
      _count: { stockId: true },
      orderBy: { _count: { stockId: "desc" } },
      take: 5,
    });

    const details = await Promise.all(
      products.map(async (entry) => {
        const stock = await prisma.stock.findUnique({
          where: { id: entry.stockId },
          include: { product: true },
        });

        return {
          productId: stock?.productId || "",
          productName: stock?.product?.name || "",
          timesRestocked: entry._count.stockId,
        };
      })
    );

    res.json({ status: 200, data: details });
  } catch (err) {
    res.status(500).json({ error: "Error getting restock trends", details: err });
  }
};

// 5. Financials: inventory value & margin
export const getInventoryFinancials = async (req: Request, res: Response) => {
  try {
    const entries = await prisma.stockEntry.findMany();

    let cost = 0;
    let revenue = 0;

    entries.forEach((s) => {
      cost += s.price * s.quantity;
      revenue += s.sellingPrice * s.quantity;
    });

    res.json({
      status: 200,
      data: {
        totalCost: cost,
        estimatedRevenue: revenue,
        margin: revenue - cost,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error calculating financials", details: err });
  }
};