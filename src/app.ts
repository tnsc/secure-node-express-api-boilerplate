import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user";
import { setupSwagger } from "./swagger";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Configure the rate limiter
const apiLimiterDefault = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 100 requests per `window` (15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes.",
  headers: true, // Send rate limit headers
});

/*
const apiLimiterSignInUp = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes.",
  headers: true, // Send rate limit headers
});

// Apply the rate limiter only to the /login route
app.post('/api/login', apiLimiter, (req, res) => {
  res.send('Login route');
});
*/

// Middleware to parse JSON bodies
app.use(express.json());
// Apply the rate limiting middleware to all API routes
app.use("/api/", apiLimiterDefault);

// Basic route
app.get("/", (_req, res) => {
  res.send("Welcome to the API!");
});

// User routes
app.use("/api/users", userRoutes);

// Setup Swagger
setupSwagger(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
