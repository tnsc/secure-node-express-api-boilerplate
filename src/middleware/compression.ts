import compression from "compression";

const compressionMiddleware = compression({
  level: 6, // Compression level (default is 6, range is 0-9)
  threshold: 1024, // Compress responses over 1KB
  filter: (req, res) => {
    // Compress only if the response is of a certain type
    if (req.headers["x-no-compression"]) {
      // Don't compress responses with this custom header
      return false;
    }
    return compression.filter(req, res);
  },
});

export default compressionMiddleware;
