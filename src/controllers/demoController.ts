import { Request, Response } from "express";
import { redisClient } from "../middleware/caching";

// Route with Redis caching
export const getDataWithCaching = (req: Request, res: Response) => {
  const data = { message: "This is some data from the database." };

  // Simulate heavy data fetching (e.g., from a database)
  setTimeout(async () => {
    await redisClient.set(req.originalUrl, JSON.stringify(data), {
      EX: 100, // Cache expiration in seconds
    });
    res.json(data);
  }, 1000); // Simulate 1-second delay
};
