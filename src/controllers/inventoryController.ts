import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { addStockSchema } from "../validators/inventoryValidator";

const prisma = new PrismaClient();

export const addStock = async (req: Request, res: Response) => {
  try {
    const { error, value } = addStockSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message) });
    }
    const { productId, quantity, price, sellingPrice, dateAdded, status } =
      value;

    // 1. Ensure a stock record exists for the product
    const stock = await prisma.stock.upsert({
      where: { productId },
      update: {
        totalQty: { increment: quantity },
      },
      create: {
        productId,
        totalQty: quantity,
      },
    });

    // 2. Add stock entry
    await prisma.stockEntry.create({
      data: {
        stockId: stock.id,
        quantity,
        price,
        sellingPrice,
        dateAdded: new Date(dateAdded),
        status,
      },
    });

    res.status(201).json({ message: "Stock added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add stock", details: err });
  }
};

export const getStockDetails = async (req: Request, res: Response) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const offset = parseInt(req.query.offset as string) || 10;

    const stockEntries = await prisma.stockEntry.findMany({
      skip: (pageNumber - 1) * offset,
      take: offset,
      orderBy: { dateAdded: "desc" },
      include: {
        stock: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 200,
      data: {
        stock: stockEntries,
        pageNumber,
        offset,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch stock details",
      details: err,
    });
  }
};

export const getInventorySummary = async (req: Request, res: Response) => {
  try {
    const total = await prisma.stockEntry.count();
    const low = await prisma.stockEntry.count({ where: { status: "Low" } });
    const out = await prisma.stockEntry.count({
      where: { status: "OutOfStock" },
    });

    res.status(200).json({
      status: 200,
      data: {
        totalStock: total,
        lowStock: low,
        outOfStock: out,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch inventory summary",
      details: err,
    });
  }
};

export const getOrderGraph = async (req: Request, res: Response) => {
  const view = (req.query.view as string) || "daily";

  try {
    const entries = await prisma.stockEntry.findMany({
      orderBy: { dateAdded: "asc" },
    });

    const grouped: Record<string, number> = {};

    for (const entry of entries) {
      let key = "";

      switch (view) {
        case "weekly":
          key = format(
            startOfWeek(entry.dateAdded, { weekStartsOn: 1 }),
            "yyyy-MM-dd"
          );
          break;
        case "monthly":
          key = format(startOfMonth(entry.dateAdded), "yyyy-MM");
          break;
        case "daily":
        default:
          key = format(entry.dateAdded, "yyyy-MM-dd");
          break;
      }

      grouped[key] = (grouped[key] || 0) + entry.quantity;
    }

    res.status(200).json({
      status: 200,
      data: {
        orders: grouped,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order data", details: err });
  }
};

export const getNewStock = async (req: Request, res: Response) => {
  try {
    const recentEntries = await prisma.stockEntry.findMany({
      orderBy: { dateAdded: "desc" },
      take: 10,
      include: {
        stock: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 200,
      data: {
        newStock: recentEntries,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch new stock entries",
      details: err,
    });
  }
};
