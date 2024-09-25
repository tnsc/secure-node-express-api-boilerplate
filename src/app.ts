/**
 * Import necessary modules and types for setting up the Express application.
 */
import express, { Express } from "express";
import { config } from "dotenv";
import userRoutes from "./routes/user";
import testRoutes from "./routes/test";
import { setupSwagger } from "./middleware/swagger";
import { apiLimiterDefault } from "./middleware/rateLimit";
import compressionMiddleware from "./middleware/compression";
import corsMiddleware from "./middleware/cors";
import helmet from "helmet";
import { securityMiddleware } from "./middleware/security"; // Custom CSP
/**
 * Load environment variables from .env file.
 */
config();

/**
 * Initialize the Express application.
 * @type {Express}
 */
const app: Express = express();

/******************************************************************************
 * Middleware
 *****************************************************************************/
/**
 * Apply Helmet middleware with default protections but disable default CSP
 */
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable default CSP to allow custom
  })
);

/**
 * Apply custom security middleware, customizing helmet
 */
app.use(securityMiddleware);

app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

/**
 * Enable CORS for specific origins.
 */
app.use(corsMiddleware);

/**
 * Add compression middleware to reduce response sizes.
 */
app.use(compressionMiddleware);

/**
 * Parse incoming request bodies as JSON.
 */
app.use(express.json());

/**
 * Apply rate limiting middleware to all API routes.
 *
 * @note The rate limiter is applied only to routes starting with the API base URL.
 */
app.use(process.env.API_BASE_URL as string, apiLimiterDefault);

/******************************************************************************
 * Routes
 *****************************************************************************/

/**
 * Mount user routes under the API base URL.
 */
app.use(`${process.env.API_BASE_URL}/users`, userRoutes);
process.env.NODE_ENV &&
  "test" &&
  app.use(`${process.env.API_BASE_URL}/test`, testRoutes);

/******************************************************************************
 * Other utils and config
 *****************************************************************************/

/**
 * Set up Swagger documentation for the API.
 *
 * @param {Express} app - The Express application instance
 */
setupSwagger(app);

/******************************************************************************
 * Server
 *****************************************************************************/

/**
 * Start the server when not running tests.
 */
if (process.env.NODE_ENV !== "test") {
  /**
   * Get the port from environment variables or use a default value.
   */
  const PORT = process.env.PORT || 3001;

  /**
   * Listen for incoming connections on the specified port.
   */
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

/**
 * Export the configured Express application.
 */
export default app;
