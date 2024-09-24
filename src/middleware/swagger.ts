import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { config } from "dotenv";
config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js REST API",
      version: "1.0.0",
      description: "A simple REST API made with Express and TypeScript",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}${
          process.env.API_BASE_URL || ""
        }`,
      },
    ],
  },
  // Paths to the API docs (JSDoc annotations)
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at /api-docs");
  app.use("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
