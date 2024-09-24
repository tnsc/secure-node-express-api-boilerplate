/**
 * Import necessary modules and types for setting up the Express application.
 */
import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors"; // Import CORS middleware
import userRoutes from "./routes/user";
import { setupSwagger } from "./middleware/swagger";
import { apiLimiterDefault } from "./middleware/rateLimit";
import compressionMiddleware from "./middleware/compression";
import corsMiddleware from "./middleware/cors";

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

/******************************************************************************
 * Other utils and config
 *****************************************************************************/

/**
 * Set up Swagger documentation for the API.
 *
 * @param {Express} app - The Express application instance
 */
setupSwagger(app);

/**
 * Test route to demonstrate compression functionality.
 */
app.get("/large", (req, res) => {
  /**
   * Set the Content-Type header for HTML responses.
   */
  res.setHeader("Content-Type", "text/html");

  /**
   * Send a large HTML response to demonstrate compression.
   */
  res.send(
    "<html><body>" +
      "Hello, this response is compressed! ".repeat(1000) +
      "</body></html>"
  );
});

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
