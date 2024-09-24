/**
 * Import the CORS middleware package.
 */
import cors from "cors";

/**
 * Array of allowed origins for CORS.
 * @type {string[]}
 */
const allowedOrigins = ["http://localhost:3000", "http://localhost:2999"];

/**
 * Configuration options for the CORS middleware.
 * @type {cors.CorsOptions}
 */
const corsOptions = {
  /**
   * Function to determine whether to allow a request based on its origin.
   *
   * @param {string|undefined} origin - Origin of the incoming request
   * @param {(err: Error|null, allow?: boolean) => void} callback - Callback function to indicate whether the request is allowed
   */
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    /**
     * Allow requests with no origin (e.g., mobile apps or curl requests).
     */
    if (!origin) return callback(null, true);

    /**
     * Check if the origin is in the list of allowed origins.
     */
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      /**
       * Reject the request if the origin is not allowed.
       */
      callback(new Error("Not allowed by CORS"));
    }
  },

  /**
   * Specify allowed HTTP methods.
   */
  methods: "GET,POST,PUT,DELETE",

  /**
   * List of allowed headers.
   */
  allowedHeaders: ["Content-Type", "Authorization"],
};

/**
 * Create and export the CORS middleware instance with the configured options.
 * @type {cors.Cors}
 */
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
