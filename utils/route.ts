// pages/api/project/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Extract id from query and ensure it's a string
    const id = req.query.id as string;

    try {
      const db = await connectDB();
      const project = await db
        .collection("projects")
        .findOne({ _id: new ObjectId(id) });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
