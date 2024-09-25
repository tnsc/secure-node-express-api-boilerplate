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
    // Enable DNS prefetch control
    dnsPrefetchControl: {
      allow: false, // Disable DNS prefetching for third-party resources
    },
    referrerPolicy: {
      policy: "no-referrer", // Hide referrer information from other sites
    },
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

  // Middleware to control DNS prefetching
  (req: Request, res: Response, next: NextFunction) => {
    // Check if the request is for third-party content
    const isThirdPartyContent = req.path === "/api/test/third-party-content";

    // Check if the request is from localhost or 127.0.0.1
    const host = req.get("host");
    const isOwnDomain =
      host?.startsWith("127.0.0.1") || host?.startsWith("localhost");

    // Set X-DNS-Prefetch-Control based on whether it's your own domain
    res.setHeader(
      "X-DNS-Prefetch-Control",
      isThirdPartyContent ? "off" : isOwnDomain ? "on" : "off"
    );
    next();
  },
];
