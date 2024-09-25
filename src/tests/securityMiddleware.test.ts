import request from "supertest";
import nock from "nock";
import app from "../app";

/**
 * Test suite for Content Security Policy Middleware
 * @description Tests various security-related headers and policies
 */
describe("Content Security Policy Middleware", () => {
  /**
   * Tests if the Content-Security-Policy header is correctly applied
   */
  it("should apply the Content-Security-Policy header", async () => {
    const response = await request(app).get("/api/test/large-content");

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

  /**
   * Tests if trusted sources are included in the img-src directive
   */
  it("should include trusted sources in img-src directive", async () => {
    const trustedSources = process.env.TRUSTED_SOURCES?.split(",") || [];
    const response = await request(app).get("/api/test/large-content");

    // Check that each trusted source is present in the img-src directive
    trustedSources.forEach((source) => {
      expect(response.headers["content-security-policy"]).toContain(source);
    });
  });

  /**
   * Tests if CSP is applied correctly on other routes
   */
  it("should apply CSP on other routes", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-security-policy"]).toContain(
      "default-src 'self'"
    );
  });

  /**
   * Tests if X-XSS-Protection header is set correctly
   */
  it("should set X-XSS-Protection header", async () => {
    const response = await request(app).get("/api/test/large-content");

    // Check that the X-XSS-Protection header is set
    expect(response.headers["x-xss-protection"]).toBeDefined();

    // Check that the value is set to '1; mode=block'
    expect(response.headers["x-xss-protection"]).toBe("1; mode=block");
  });

  /**
   * Tests if X-Frame-Options header is set correctly
   */
  it("should set X-Frame-Options header", async () => {
    const response = await request(app).get("/api/test/large-content"); // Adjust the route as necessary

    // Check that the X-Frame-Options header is set correctly
    expect(response.headers["x-frame-options"]).toBe("DENY");
  });

  /**
   * Tests if Strict-Transport-Security header is set correctly
   */
  it("should set Strict-Transport-Security header", async () => {
    const response = await request(app).get("/api/test/large-content"); // Adjust the route as necessary

    // Check that the Strict-Transport-Security header is set correctly
    expect(response.headers["strict-transport-security"]).toBe(
      "max-age=31536000; includeSubDomains; preload"
    );
  });

  /**
   * Tests if secure cookies are set correctly
   */
  it("should set secure cookies", async () => {
    const response = await request(app).get("/api/test/large-content");
    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("HttpOnly");
    if (process.env.NODE_ENV !== "test") {
      expect(cookies[0]).toContain("Secure");
    }
    expect(cookies[0]).toContain("SameSite=Strict");
  });

  /**
   * Tests if Secure flag is not set in non-HTTPS environments
   */
  it("should not set the Secure flag in non-HTTPS environments", async () => {
    process.env.NODE_ENV = "development"; // Simulate non-HTTPS environment

    const response = await request(app).get("/api/test/large-content");

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("HttpOnly");
    expect(cookies[0]).not.toContain("Secure"); // Secure flag should not be present
    expect(cookies[0]).toContain("SameSite=Strict");
  });

  /**
   * Tests if Secure flag is set in HTTPS environments
   */
  it("should set the Secure flag in HTTPS environments", async () => {
    process.env.NODE_ENV = "production"; // Simulate production environment

    const response = await request(app).get("/api/test/large-content");

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("HttpOnly");
    expect(cookies[0]).toContain("Secure"); // Secure flag should be present in production
    expect(cookies[0]).toContain("SameSite=Strict");
  });

  /**
   * Tests if Max-Age and Expires headers are set correctly
   */
  it("should set the correct Max-Age and Expires headers", async () => {
    const response = await request(app).get("/api/test/large-content");

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("Max-Age=86400"); // 1 day
    expect(cookies[0]).toMatch(/Expires=[^;]+GMT/); // Ensure Expires is set
  });

  /**
   * Tests DNS prefetching settings
   */
  it("should allow DNS prefetching for own website", async () => {
    const response = await request(app).get("/"); // Test your main route

    // Check the X-DNS-Prefetch-Control header is set to 'on' for own resources
    expect(response.headers["x-dns-prefetch-control"]).toBe("on");
  });

  /**
   * Tests DNS prefetching settings for third-party content
   */
  it("should disable DNS prefetching for third-party content", async () => {
    // Mock the third-party request
    nock("https://example.com")
      .get("/")
      .reply(200, "<html><body>Mocked third-party content</body></html>");

    const response = await request(app).get("/api/test/third-party-content");

    // Ensure DNS prefetching is disabled for third-party resources
    expect(response.headers["x-dns-prefetch-control"]).toBe("off");
  });

  /**
   * Tests removal of X-Powered-By header
   */
  it("should remove X-Powered-By header", async () => {
    const response = await request(app).get("/api/test/large-content");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  /**
   * Tests Permissions-Policy header
   */
  it("should set Permissions-Policy header", async () => {
    const response = await request(app).get("/api/test/large-content");

    expect(response.headers["permissions-policy"]).toBe(
      "geolocation=(), microphone=(), camera=(), fullscreen=(self)"
    );
  });

  /**
   * Tests Cross-Origin-Embedder-Policy header
   */
  it("should set Cross-Origin-Embedder-Policy header to 'require-corp'", async () => {
    const response = await request(app).get("/api/test/large-content");
    expect(response.headers["cross-origin-embedder-policy"]).toBe(
      "require-corp"
    );
  });

  /**
   * Tests Cross-Origin-Resource-Policy header
   */
  it("should set Cross-Origin-Resource-Policy header to 'same-origin'", async () => {
    const response = await request(app).get("/api/test/large-content");
    expect(response.headers["cross-origin-resource-policy"]).toBe(
      "same-origin"
    );
  });
});
