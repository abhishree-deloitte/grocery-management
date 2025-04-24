import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShipmentDetails = async (req: Request, res: Response) => {
  const { pageNumber = '1', offset = '10', status = '' } = req.query;

  const page = parseInt(pageNumber as string);
  const limit = parseInt(offset as string);
  const skip = (page - 1) * limit;

  try {
    const shipmentData = await prisma.shipment.findMany({
      where: status ? { shipmentStatus: status as string } : undefined,
      skip,
      take: limit,
      include: {
        product: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    const formatted = shipmentData.map(s => ({
      shipmentId: s.id,
      productId: s.productId,
      productName: s.product.name,
      supplierId: s.supplierId,
      supplierName: s.supplier.name,
      quantity: s.quantity,
      price: s.price,
      DeliveryDate: s.deliveryDate,
      shipperName: s.shipperName,
      shipmentDestination: s.shipmentDestination,
      shipmentStatus: s.shipmentStatus,
      lat: s.lat,
      long: s.long,
    }));

    res.status(200).json({ status: 200, data: { shipment: formatted } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment details', details: err });
  }
};
