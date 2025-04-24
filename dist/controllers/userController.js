"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProfile = async (req, res) => {
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
        if (!user)
            res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            status: 200,
            message: 'Profile details fetched successfully',
            data: user,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching profile', details: err });
    }
};
exports.getProfile = getProfile;
