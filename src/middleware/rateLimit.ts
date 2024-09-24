import rateLimit from "express-rate-limit";

// Configure the rate limiter
export const apiLimiterDefault = rateLimit({
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
app.post('/api/login', apiLimiterSignInUp, (req, res) => {
  res.send('Login route');
});
*/
