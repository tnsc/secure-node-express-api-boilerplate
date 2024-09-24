import request from "supertest";
import express, { Express } from "express";
import corsMiddleware from "../middleware/cors";

describe("CORS Middleware", () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    // Use the CORS middleware
    app.use(corsMiddleware);

    // Create a test route
    app.get("/test", (req, res) => {
      res.json({ message: "CORS test passed" });
    });
  });

  it("should allow requests from allowed origins", async () => {
    const response = await request(app)
      .get("/test")
      .set("Origin", "http://localhost:3000");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "CORS test passed" });

    // Check CORS headers
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000"
    );
  });

  it("should block requests from disallowed origins", async () => {
    const response = await request(app)
      .get("/test")
      .set("Origin", "http://disallowed-origin.com");

    expect(response.status).toBe(500); // CORS rejection throws an error
    expect(response.text).toContain("Error: Not allowed by CORS");
  });

  it("should allow requests with no origin (e.g., curl or mobile app)", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "CORS test passed" });

    // Ensure no CORS headers are set, as there's no origin
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
