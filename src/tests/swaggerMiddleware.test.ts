/**
 * Import the supertest library for testing HTTP servers.
 */
import request from "supertest";

/**
 * Import the Express application instance to be tested.
 */
import app from "../app"; // Adjust the path based on your project structure

/**
 * Test suite for Swagger Middleware functionality.
 */
describe("Swagger Middleware", () => {
  /**
   * Test case to verify that Swagger documentation is served correctly.
   */
  it("should serve Swagger documentation at /api-docs", async () => {
    /**
     * Make a GET request to the Swagger documentation endpoint.
     */
    const response = await request(app).get("/api-docs/"); // or /api-docs/ based on your route

    /**
     * Assert that the HTTP status code is 200 (OK).
     */
    expect(response.status).toBe(200);

    /**
     * Verify that the response contains Swagger UI elements.
     */
    expect(response.text).toContain("Swagger UI"); // Adjust this if needed based on your Swagger UI's structure
  });

  /**
   * Test case to verify that Swagger JSON specification is served correctly.
   */
  it("should serve Swagger JSON at /api-docs.json", async () => {
    /**
     * Make a GET request to the Swagger JSON specification endpoint.
     */
    const response = await request(app).get("/api-docs.json/");

    /**
     * Assert that the HTTP status code is 200 (OK).
     */
    expect(response.status).toBe(200);

    /**
     * Verify that the response body contains a valid Swagger JSON object.
     */
    expect(response.body).toHaveProperty("openapi", "3.0.0");

    /**
     * Check for the presence of the 'info' property in the Swagger JSON.
     */
    expect(response.body).toHaveProperty("info");

    /**
     * Verify specific properties within the 'info' section of the Swagger JSON.
     */
    expect(response.body.info).toHaveProperty("title", "Node.js REST API");
    expect(response.body.info).toHaveProperty("version", "1.0.0");
  });
});
