import request from "supertest";
import app from "../app";

describe("API Integration Tests", () => {
  it("GET /api/users should return all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Fail motherfucker" },
      { id: 2, name: "Bob" },
    ]);
  });

  it("GET /api/users/:id should return a user by ID", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Alice" });
  });

  it("GET /api/users/:id should return 404 if user is not found", async () => {
    const response = await request(app).get("/api/users/99");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });
});
