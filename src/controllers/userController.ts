import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        username: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      status: 200,
      message: 'Profile details fetched successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile', details: err });
  }
};
