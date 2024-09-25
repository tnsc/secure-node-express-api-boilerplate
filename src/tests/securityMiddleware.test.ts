import request from "supertest";
import app from "../app";

describe("Content Security Policy Middleware", () => {
  it("should apply the Content-Security-Policy header", async () => {
    const response = await request(app).get("/large");

    // Check that the CSP header includes the correct defaultSrc directive
    expect(response.headers["content-security-policy"]).toContain(
      "default-src 'self'"
    );

    // Check that the imgSrc directive is applied correctly
    expect(response.headers["content-security-policy"]).toContain(
      "img-src 'self' data:"
    );

    // Check the scriptSrc directive
    expect(response.headers["content-security-policy"]).toContain(
      "script-src 'self'"
    );
  });

  it("should include trusted sources in img-src directive", async () => {
    const trustedSources = process.env.TRUSTED_SOURCES?.split(",") || [];
    const response = await request(app).get("/large");

    // Check that each trusted source is present in the img-src directive
    trustedSources.forEach((source) => {
      expect(response.headers["content-security-policy"]).toContain(source);
    });
  });

  it("should apply CSP on other routes", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-security-policy"]).toContain(
      "default-src 'self'"
    );
  });

  it("should set X-XSS-Protection header", async () => {
    const response = await request(app).get("/large");

    // Check that the X-XSS-Protection header is set
    expect(response.headers["x-xss-protection"]).toBeDefined();

    // Check that the value is set to '1; mode=block'
    expect(response.headers["x-xss-protection"]).toBe("1; mode=block");
  });
});
