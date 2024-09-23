import express, { Express } from "express";
import userRoutes from "./routes/user";
import { setupSwagger } from "./swagger";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

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
