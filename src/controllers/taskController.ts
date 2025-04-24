import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      taskType,
      assignee,
      priorityLevel,
      description,
      dueDate,
      location,
    } = req.body;

    const task = await prisma.task.create({
      data: {
        userId: req.user.id,
        taskType,
        assignee,
        priorityLevel,
        description,
        dueDate: new Date(dueDate),
        location,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Task created successfully",
      data: {
        taskId: task.id,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create task",
      details: err,
    });
  }
};
