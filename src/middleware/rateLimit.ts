/**
 * Import the express-rate-limit middleware for rate limiting API requests.
 */
import rateLimit from "express-rate-limit";

/**
 * Configure the default rate limiter for API endpoints.
 *
 * @type {rateLimit}
 */
export const apiLimiterDefault = rateLimit({
  /**
   * Time window in milliseconds during which the rate limit applies.
   * @default {number} 60000 - 1 minute
   */
  windowMs: 60 * 1000,

  /**
   * Maximum number of requests allowed within the time window.
   * @default {number} 15
   */
  max: 15,

  /**
   * Custom error message returned when the rate limit is exceeded.
   * @default {string} "Too many requests from this IP, please try again after 15 minutes."
   */
  message: "Too many requests from this IP, please try again after 15 minutes.",

  /**
   * Whether to send rate limit headers in the response.
   * @default {boolean} true
   */
  headers: true,
});

/**
 * Configure a separate rate limiter for sign-in/up routes.
 *
 * @type {rateLimit}
 */
const apiLimiterSignInUp = rateLimit({
  /**
   * Time window in milliseconds during which the rate limit applies.
   * @default {number} 900000 - 15 minutes
   */
  windowMs: 15 * 60 * 1000,

  /**
   * Maximum number of requests allowed within the time window.
   * @default {number} 10
   */
  max: 10,

  /**
   * Custom error message returned when the rate limit is exceeded.
   * @default {string} "Too many requests from this IP, please try again after 15 minutes."
   */
  message: "Too many requests from this IP, please try again after 15 minutes.",

  /**
   * Whether to send rate limit headers in the response.
   * @default {boolean} true
   */
  headers: true,
});

/**
 * Apply the rate limiter specifically to the login route.
 *
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
/* app.post("/api/login", apiLimiterSignInUp, (req, res) => {
  res.send("Login route");
}); */
