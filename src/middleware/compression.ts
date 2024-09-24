/**
 * Import the compression middleware module.
 */
import compression from "compression";

/**
 * Create and configure the compression middleware.
 *
 * @type {import("compression").Compression}
 */
const compressionMiddleware = compression({
  /**
   * Set the compression level (range: 0-9). Higher values compress more but are slower.
   * @default {number} 6
   */
  level: 6,

  /**
   * Minimum response size in bytes to trigger compression.
   * Responses smaller than this threshold won't be compressed.
   * @default {number} 1024 (1 KB)
   */
  threshold: 1024,

  /**
   * Custom filter function to determine whether to compress a response.
   *
   * @param {import("http").IncomingMessage} req - HTTP request object
   * @param {import("http").ServerResponse} res - HTTP response object
   * @returns {boolean} True if the response should be compressed, false otherwise
   */
  filter: (req, res) => {
    /**
     * Check for a custom header to bypass compression.
     */
    if (req.headers["x-no-compression"]) {
      /**
       * Don't compress responses with the x-no-compression header.
       */
      return false;
    }

    /**
     * Fallback to the default compression filter if no custom conditions apply.
     */
    return compression.filter(req, res);
  },
});

/**
 * Export the configured compression middleware.
 */
export default compressionMiddleware;
