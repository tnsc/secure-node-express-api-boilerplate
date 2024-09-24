import request from "supertest";
import express from "express";
import { apiLimiterDefault } from "../middleware/rateLimit";

const app = express();

// Apply the rate limit middleware to a test route
app.use("/test", apiLimiterDefault, (req, res) => {
  res.status(200).send("Success");
});

describe("Rate Limit Middleware", () => {
  it("should allow requests below the limit", async () => {
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Success");
  });

  it("should return 429 status when rate limit is exceeded", async () => {
    // Send 15 requests to hit the limit
    for (let i = 0; i < 15; i++) {
      await request(app).get("/test");
    }

    // The 16th request should exceed the limit
    const response = await request(app).get("/test");

    expect(response.status).toBe(429);
    expect(response.text).toBe(
      "Too many requests from this IP, please try again after 15 minutes."
    );
  });

  it("should include rate limit headers in the response", async () => {
    // Send 15 requests to hit the limit
    for (let i = 0; i < 15; i++) {
      await request(app).get("/test");
    }

    // The 16th request should exceed the limit
    const response = await request(app).get("/test");

    expect(response.status).toBe(429);
    expect(response.headers["x-ratelimit-limit"]).toBe("15");
    expect(response.headers["x-ratelimit-remaining"]).toBe("0");
    expect(response.headers["x-ratelimit-reset"]).toBeDefined(); // Check if reset time is defined
  });
});
