/**
 * Import necessary types from Express for request and response handling.
 */
import { Request, Response } from "express";

/**
 * Import the Redis client for caching functionality.
 */
import { redisClient } from "../middleware/caching";

/**
 * Controller function to handle data retrieval with Redis caching.
 *
 * This function simulates fetching data from a database, caches the result in Redis,
 * and returns the data to the client.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Does not return a value, sends JSON response asynchronously
 */
export const getDataWithCaching = (req: Request, res: Response) => {
  /**
   * Simulated data retrieved from a database.
   * In a real scenario, this would likely come from a database query.
   * @type {{message: string}}
   */
  const data = { message: "This is some data from the database." };

  /**
   * Simulate heavy data fetching (e.g., from a database) with a delay.
   * In a production environment, this would typically be replaced with an actual database query.
   */
  setTimeout(async () => {
    /**
     * Cache the retrieved data in Redis.
     *
     * @param {string} req.originalUrl - Used as the cache key
     * @param {string} JSON.stringify(data) - Cached value (data converted to JSON string)
     * @param {object} {EX: 100} - Redis expiration option (cache expires after 100 seconds)
     */
    await redisClient.set(req.originalUrl, JSON.stringify(data), {
      /**
       * Set cache expiration time in seconds.
       */
      EX: 100, // Cache expiration in seconds
    });

    /**
     * Send the retrieved data back to the client as JSON.
     */
    res.json(data);
  }, 1000); // Simulate 1-second delay
};

// Mocking Redis client
jest.mock("../middleware/caching", () => ({
  redisClient: {
    set: jest.fn(),
  },
}));

describe("getDataWithCaching", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data after caching", async () => {
    const req = { originalUrl: "/test" } as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await new Promise<void>((resolve) => {
      getDataWithCaching(req, res);

      // Allow time for the simulated database delay
      setTimeout(() => {
        // Check if the response was sent with correct data
        expect(res.json).toHaveBeenCalledWith({
          message: "This is some data from the database.",
        });

        // Verify that the data was cached in Redis
        expect(redisClient.set).toHaveBeenCalledWith(
          "/test",
          '{"message":"This is some data from the database."}',
          { EX: 100 }
        );
        resolve();
      }, 1100); // Wait slightly longer than the timeout in the controller
    });
  });
});
