import { Request, Response } from "express";
import { getDataWithCaching } from "../controllers/demoController";
import { redisClient } from "../middleware/caching";

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
