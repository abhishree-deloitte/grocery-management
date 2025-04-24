import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBlogs = async (req: Request, res: Response) => {
  const { pageNumber = "1", offset = "10" } = req.query;
  const skip =
    (parseInt(pageNumber as string) - 1) * parseInt(offset as string);

  try {
    const blogs = await prisma.blog.findMany({
      skip,
      take: parseInt(offset as string),
      orderBy: { year: "desc" },
    });

    res.status(200).json({ status: 200, data: { Blogs: blogs } });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs", details: err });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const blogId = req.params.id;

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) res.status(404).json({ error: "Blog not found" });

    res.status(200).json({ status: 200, data: { Blog: blog } });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog", details: err });
  }
};
