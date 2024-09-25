import helmet from "helmet";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";

/**
 * Security middleware to set HTTP headers for security and handle secure cookies.
 */
export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Explicitly set to 'self'
        imgSrc: ["'self'", "data:", "http://localhost:3000"], // Trusted sources
        scriptSrc: ["'self'"], // Only allow scripts from self
      },
    },
    frameguard: { action: "deny" }, // X-Frame-Options: deny
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply to subdomains
      preload: true, // Preload in browsers
    },
    xssFilter: true, // X-XSS-Protection: 1; mode=block
  }),

  // Parse cookies
  cookieParser(),

  // Middleware to set secure cookies
  (_req: Request, res: Response, next: NextFunction) => {
    res.cookie("session_id", "some-session-value", {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true, // JavaScript can't access the cookie
      sameSite: "strict", // No cross-site cookie sharing
      maxAge: 1000 * 60 * 60 * 24, // Cookie valid for 1 day
    });
    next();
  },
];
