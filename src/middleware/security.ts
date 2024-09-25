import helmet from "helmet";

/**
 * Security middleware to set various HTTP headers for improved security.
 */
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Explicitly set to 'self'
      imgSrc: ["'self'", "data:", "http://localhost:3000"], // Ensure trusted sources are included
      scriptSrc: ["'self'"], // Allow scripts only from 'self'
    },
  },
  frameguard: {
    action: "deny", // This can be 'deny', 'sameorigin', or 'allow-from'
  },
});
