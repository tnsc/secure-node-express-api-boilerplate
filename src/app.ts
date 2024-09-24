import express, { Express } from "express";
import { config } from "dotenv";
import userRoutes from "./routes/user";
import demoRoutes from "./routes/demo";
import { setupSwagger } from "./swagger";
import { apiLimiterDefault } from "./middleware/rateLimit";
import compressionMiddleware from "./middleware/compression";

config();
const app: Express = express();

/******************************************************************************
 * Middleware
 *****************************************************************************/
// Add compression middleware before routes
app.use(compressionMiddleware);
// Middleware to parse JSON bodies
app.use(express.json());
// Apply the rate limiting middleware to all API routes
app.use(process.env.API_BASE_URL as string, apiLimiterDefault);

/******************************************************************************
 * Routes
 *****************************************************************************/
// User routes
app.use(`${process.env.API_BASE_URL}/users`, userRoutes);
// Demo caching routes
app.use(`${process.env.API_BASE_URL}/demoCaching`, demoRoutes);

/******************************************************************************
 * Other utils and config
 *****************************************************************************/
// Setup Swagger
setupSwagger(app);

// Basic route
app.get("/large", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(
    "<html><body>" +
      "Hello, this response is compressed! ".repeat(1000) +
      "</body></html>"
  );
});

/******************************************************************************
 * Server
 *****************************************************************************/
// The following should only be used when running the app normally, not in tests
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
