/**
 * Import necessary modules for setting up an Express server and Redis client.
 */
import express from "express";
import { createClient } from "redis";
import { config } from "dotenv";

/**
 * Load environment variables from .env file.
 */
config();

/**
 * Create a Redis client instance.
 *
 * @type {RedisClientType<RedisModules, RedisFunctions, RedisScripts>}
 */
export const redisClient = createClient({
  /**
   * Redis connection URL.
   */
  url: `${process.env.REDIS_URL}`,
});

/**
 * Connect to the Redis server.
 *
 * @throws Will log any connection errors to the console.
 */
redisClient.connect().catch(console.error);

/**
 * Middleware function to check Redis cache before processing requests.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const checkCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  /**
   * Generate a cache key based on the original URL of the request.
   * @type {string}
   */
  const key = req.originalUrl;

  try {
    /**
     * Retrieve cached data from Redis using the generated key.
     */
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      /**
       * If cached data exists, parse it as JSON and send it as the response.
       */
      return res.json(JSON.parse(cachedData));
    }

    /**
     * If no cached data is found, proceed to the next middleware in the chain.
     */
    next();
  } catch (error) {
    /**
     * Log any Redis-related errors to the console.
     */
    console.error("Redis error:", error);

    /**
     * Even if an error occurs, proceed to the next middleware in the chain.
     */
    next();
  }
};
