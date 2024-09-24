import express, { Express } from "express";
import { config } from "dotenv";
import userRoutes from "./routes/user";
import demoRoutes from "./routes/demo";
import { setupSwagger } from "./swagger";
import { apiLimiterDefault } from "./middleware/rateLimit";

config();
const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
// Apply the rate limiting middleware to all API routes
app.use(process.env.API_BASE_URL as string, apiLimiterDefault);

// Basic route
app.get("/", (_req, res) => {
  res.send("Welcome to the API!");
});

// User routes
app.use(`${process.env.API_BASE_URL}/users`, userRoutes);

// Demo caching
app.use(`${process.env.API_BASE_URL}/demoCaching`, demoRoutes);

// Setup Swagger
setupSwagger(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
