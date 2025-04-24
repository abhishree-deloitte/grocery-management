import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
      consumerName
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
        consumerName
      }
    });

    res.status(201).json({
      status: 201,
      message: 'Stock created successfully',
      data: stock
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to add stock',
      details: err
    });
  }
};
