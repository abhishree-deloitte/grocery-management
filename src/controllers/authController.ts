import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, firstName, lastName, email, phone } = req.body;
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        firstName,
        lastName,
        email,
        phone,
      },
    });

    const token = generateToken({ id: user.id, username: user.username });

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: "Signup failed", details: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user: any = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err });
  }
};

export const signout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token) {
    const decoded: any = jwt.decode(token);
    const expiry = new Date(decoded.exp * 1000); // Convert UNIX timestamp to Date

    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: expiry,
      },
    });
  }

  res.status(200).json({ status: 200, message: "Logged out successfully" });
};
