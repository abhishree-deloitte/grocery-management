import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { subDays, subMonths } from 'date-fns';

const prisma = new PrismaClient();


export const getOrdersSummary = async (req: Request, res: Response) => {
  try {
    let { startDate, endDate, type } = req.query as Record<string, string>;

    const today = new Date();

    // Only apply `type` shortcut if both startDate and endDate are missing
    if (!startDate && !endDate && type) {
      switch (type.toLowerCase()) {
        case 'daily':
          startDate = endDate = today.toISOString();
          break;
        case 'weekly':
          startDate = subDays(today, 7).toISOString();
          endDate = today.toISOString();
          break;
        case 'monthly':
          startDate = subMonths(today, 1).toISOString();
          endDate = today.toISOString();
          break;
        case 'last3months':
          startDate = subMonths(today, 3).toISOString();
          endDate = today.toISOString();
          break;
        case 'last6months':
          startDate = subMonths(today, 6).toISOString();
          endDate = today.toISOString();
          break;
        default:
            res.status(400).json({ error: 'Invalid "type" provided' });
      }
    }

    if (!startDate || !endDate) {
        res.status(400).json({ error: 'Either startDate & endDate or type is required' });
    }

    const filters = {
      deliveryDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    const activeCount = await prisma.shipment.count({
      where: {
        shipmentStatus: 'Active',
        ...filters,
      },
    });

    const inactiveCount = await prisma.shipment.count({
      where: {
        shipmentStatus: 'Inactive',
        ...filters,
      },
    });

    res.status(200).json({
      status: 200,
      data: {
        orders: {
          Active: activeCount,
          Inactive: inactiveCount,
        },
      },
    });
  } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders summary', details: err });
  }
};


export const getShipmentStats = async (req: Request, res: Response) => {
  try {
    const total = await prisma.shipment.count();
    const completed = await prisma.shipment.count({
      where: { shipmentStatus: "Completed" },
    });
    const inTransit = await prisma.shipment.count({
      where: { shipmentStatus: "In-Transit" },
    });
    const pending = await prisma.shipment.count({
      where: { shipmentStatus: "Pending" },
    });
    const failed = await prisma.shipment.count({
      where: { shipmentStatus: "Failed" },
    });

    res.status(200).json({
      status: 200,
      data: {
        Total: total,
        Completed: completed,
        InTransit: inTransit,
        Pending: pending,
        Failed: failed,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch shipment stats", details: err });
  }
};

export const getBlogWidget = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      take: 2,
      orderBy: { createdDate: "desc" },
      select: {
        id: true,
        image: true,
        title: true,
        description: true,
        createdDate: true,
      },
    });

    res.status(200).json({
      status: 200,
      data: {
        Blogs: blogs,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs", details: err });
  }
};
