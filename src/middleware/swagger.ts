/**
 * Import necessary modules for setting up Swagger documentation.
 */
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { config } from "dotenv";

/**
 * Load environment variables from .env file.
 */
config();

/**
 * Configuration options for generating Swagger documentation.
 * @type {swaggerJSDoc.Options}
 */
const options = {
  /**
   * Define the OpenAPI specification.
   */
  definition: {
    /**
     * OpenAPI version.
     */
    openapi: "3.0.0",

    /**
     * API metadata.
     */
    info: {
      /**
       * Title of the API.
       */
      title: "Node.js REST API",

      /**
       * Version of the API.
       */
      version: "1.0.0",

      /**
       * Brief description of the API.
       */
      description: "A simple REST API made with Express and TypeScript",
    },

    /**
     * List of servers where the API is deployed.
     */
    servers: [
      {
        /**
         * URL of the server, constructed using environment variables.
         */
        url: `http://localhost:${process.env.PORT || 3001}${
          process.env.API_BASE_URL || ""
        }`,
      },
    ],
  },

  /**
   * Paths to the API documentation (JSDoc annotations).
   */
  apis: ["./src/routes/*.ts"],
};

/**
 * Generate Swagger specification using the provided options.
 * @type {swaggerJSDoc.SwaggerDefinition}
 */
const swaggerSpec = swaggerJSDoc(options);

/**
 * Function to set up Swagger documentation for the Express application.
 *
 * @param {Express} app - Express application instance
 */
export const setupSwagger = (app: Express) => {
  /**
   * Mount Swagger UI at /api-docs endpoint.
   */
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * Log a message indicating that Swagger docs are available.
   */
  console.log("Swagger docs available at /api-docs");

  /**
   * Serve Swagger JSON specification at /api-docs.json endpoint.
   */
  app.use("/api-docs.json", (req, res) => {
    /**
     * Set Content-Type header for JSON response.
     */
    res.setHeader("Content-Type", "application/json");

    /**
     * Send Swagger specification as JSON response.
     */
    res.send(swaggerSpec);
  });
};
