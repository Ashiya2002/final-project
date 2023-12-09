import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

// Connect to MongoDB (replace with your connection logic)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        const projectId = req.query.projectId;
        await client.connect();
        const db = client.db('flexibble'); // Replace with your DB name
        const result = await db.collection('project').deleteOne({ _id: new ObjectId(projectId as string) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Project deleted' });
        } else {
            throw new Error('Project not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
