/**
 * Import necessary modules for security middleware.
 */
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";

/**
 * Security middleware array to enhance HTTP header security and handle secure cookies.
 * @type {(RequestHandler[])}
 */
export const securityMiddleware = [
  /**
   * Helmet configuration for various security-related HTTP headers.
   */
  helmet({
    /**
     * Content Security Policy configuration.
     * @type {helmet.ContentSecurityPolicyOptions}
     */
    contentSecurityPolicy: {
      /**
       * Directives for Content Security Policy.
       */
      directives: {
        /**
         * Default policy for fetching resources such as scripts, stylesheets, images, fonts, etc.
         * Set to 'self' to allow loading resources only from the same origin.
         */
        defaultSrc: ["'self'"],

        /**
         * Policy for loading images.
         * Allows images from 'self', data URIs, and http://localhost:3000.
         */
        imgSrc: ["'self'", "data:", "http://localhost:3000"],

        /**
         * Policy for loading scripts.
         * Set to 'self' to allow script execution only from the same origin.
         */
        scriptSrc: ["'self'"],
      },
    },

    /**
     * Configure X-Frame-Options header to prevent clickjacking attacks.
     */
    frameguard: { action: "deny" },

    /**
     * Configure HTTP Strict Transport Security (HSTS).
     */
    hsts: {
      /**
       * Maximum age of HSTS policy in seconds.
       */
      maxAge: 31536000,

      /**
       * Include subdomains in HSTS policy.
       */
      includeSubDomains: true,

      /**
       * Preload the site in browsers' HSTS preload lists.
       */
      preload: true,
    },

    /**
     * Enable XSS protection.
     */
    xssFilter: true,

    /**
     * Configure DNS prefetch control.
     */
    dnsPrefetchControl: {
      /**
       * Disable DNS prefetching for third-party resources.
       */
      allow: false,
    },

    /**
     * Configure referrer policy.
     */
    referrerPolicy: {
      /**
       * Hide referrer information when navigating to other sites.
       */
      policy: "no-referrer",
    },
  }),

  /**
   * Middleware to prevent MIME sniffing.
   */
  (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Set X-Content-Type-Options header to nosniff.
     */
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  },

  /**
   * Middleware to hide the "X-Powered-By" header.
   */
  (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Remove X-Powered-By header to hide information about the backend technology.
     */
    res.removeHeader("X-Powered-By");
    next();
  },

  /**
   * Middleware to set Permissions-Policy header.
   * Controls which browser features can be used in the website.
   */
  (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), fullscreen=(self)" // Example policies
    );
    next();
  },

  /**
   * Cookie parsing middleware.
   */
  cookieParser(),

  /**
   * Middleware to set secure cookies.
   */
  (_req: Request, res: Response, next: NextFunction) => {
    /**
     * Set a session_id cookie with security options.
     */
    res.cookie("session_id", "some-session-value", {
      /**
       * Enable HTTPS only in production environment.
       */
      secure: process.env.NODE_ENV === "production",

      /**
       * Prevent JavaScript access to the cookie.
       */
      httpOnly: true,

      /**
       * Restrict cross-site cookie sharing.
       */
      sameSite: "strict",

      /**
       * Set cookie expiration time (1 day).
       */
      maxAge: 1000 * 60 * 60 * 24,
    });
    next();
  },

  /**
   * Middleware to control DNS prefetching based on request characteristics.
   */
  (req: Request, res: Response, next: NextFunction) => {
    /**
     * Check if the request is for third-party content.
     */
    const isThirdPartyContent = req.path === "/api/test/third-party-content";

    /**
     * Check if the request is from localhost or 127.0.0.1.
     */
    const host = req.get("host");
    const isOwnDomain =
      host?.startsWith("127.0.0.1") || host?.startsWith("localhost");

    /**
     * Set X-DNS-Prefetch-Control header based on whether it's third-party content or own domain.
     */
    res.setHeader(
      "X-DNS-Prefetch-Control",
      isThirdPartyContent ? "off" : isOwnDomain ? "on" : "off"
    );
    next();
  },
];
