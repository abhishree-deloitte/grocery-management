import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export const addStock = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      quantity,
      price,
      sellingPrice,
      dateAdded,
      status,
      cashier,
      consumerName,
    } = req.body;

    const stock = await prisma.stock.create({
      data: {
        productId,
        quantity,
        price,
        sellingPrice,
        dateAdded: new Date(dateAdded),
        status,
        cashier,
        consumerName,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Stock created successfully",
      data: stock,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add stock",
      details: err,
    });
  }
};

export const getStockDetails = async (req: Request, res: Response) => {
  const { pageNumber = "1", offset = "10", status } = req.query;

  const page = parseInt(pageNumber as string);
  const limit = parseInt(offset as string);
  const skip = (page - 1) * limit;

  try {
    const stock = await prisma.stock.findMany({
      where: status ? { status: status as string } : undefined,
      skip,
      take: limit,
      include: {
        product: { select: { name: true } },
      },
    });

    const formatted = stock.map((s) => ({
      productId: s.productId,
      productName: s.product.name,
      consumerName: s.consumerName,
      supplierName: "N/A", // no supplier in Stock model directly
      dateOfEntry: s.dateAdded,
      quantity: s.quantity,
      price: s.price,
      sellingPrice: s.sellingPrice,
      cashier: s.cashier,
      status: s.status,
    }));

    res.status(200).json({
      status: 200,
      data: { stock: formatted },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch stock details", details: err });
  }
};

export const getInventorySummary = async (req: Request, res: Response) => {
  try {
    const totalStock = await prisma.stock.aggregate({
      _sum: { quantity: true },
    });
    const lowStock = await prisma.stock.count({ where: { status: "Low" } });
    const outOfStock = await prisma.stock.count({
      where: { status: "OutOfStock" },
    });
    const highDemandOrders = 20; // hardcoded for now

    res.status(200).json({
      status: 200,
      data: {
        totalStock: totalStock._sum.quantity || 0,
        lowStock,
        outOfStock,
        highDemandOrders,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get inventory summary", details: err });
  }
};

export const getOrderGraph = async (req: Request, res: Response) => {
  const { view = "daily" } = req.query;

  try {
    const orders = await prisma.stock.groupBy({
      by: ["dateAdded"],
      _count: true,
      orderBy: { dateAdded: "asc" },
    });

    const formatted = orders.map((o) => ({
      date: format(new Date(o.dateAdded), "yyyy-MM-dd"),
      totalOrders: o._count,
    }));

    res.status(200).json({
      status: 200,
      data: {
        orders: formatted,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch order graph", details: err });
  }
};

export const getNewStock = async (req: Request, res: Response) => {
  try {
    const newStock = await prisma.stock.findMany({
      orderBy: { dateAdded: "desc" },
      take: 5,
      select: {
        productId: true,
        product: { select: { name: true } },
        quantity: true,
        dateAdded: true,
      },
    });

    const formatted = newStock.map((s) => ({
      productId: s.productId,
      productName: s.product.name,
      quantity: s.quantity,
      dateAdded: s.dateAdded,
    }));

    res.status(200).json({
      status: 200,
      data: {
        newStock: formatted,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch new stock", details: err });
  }
};
