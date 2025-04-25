import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { taskSchema } from "../validators/taskValidator";

const prisma = new PrismaClient();

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details.map((d) => d.message) });
    }
    const {
      taskType,
      assignee,
      priorityLevel,
      description,
      dueDate,
      location,
    } = value;

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
