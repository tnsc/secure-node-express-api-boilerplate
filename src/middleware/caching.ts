import express from "express";
import { createClient } from "redis";
import { config } from "dotenv";
config();

export const redisClient = createClient({
  url: `${process.env.REDIS_URL}`,
});
redisClient.connect().catch(console.error); // Connect to Redis

// Middleware to check Redis cache
export const checkCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const key = req.originalUrl;
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData)); // Send cached data if available
    }
    next();
  } catch (error) {
    console.error("Redis error:", error);
    next();
  }
};
