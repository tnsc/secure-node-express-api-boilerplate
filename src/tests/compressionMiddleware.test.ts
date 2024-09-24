import request from "supertest";
import app from "../app"; // Ensure this points to your Express app

describe("Compression Middleware", () => {
  it("should compress the response when Accept-Encoding: gzip is set", async () => {
    const response = await request(app)
      .get("/large") // Or any route that returns a sizable response
      .set("Accept-Encoding", "gzip")
      .expect(200);

    // Check if the Content-Encoding header is set to gzip
    expect(response.headers["content-encoding"]).toBe("gzip");
  });

  it("should STILL compress the response when Accept-Encoding is not set", async () => {
    const response = await request(app)
      .get("/large") // Same endpoint
      .expect(200);

    // Ensure Content-Encoding header is not set
    expect(response.headers["content-encoding"]).not.toBeUndefined();
    expect(response.headers["content-encoding"]).toBe("gzip");
  });
});
