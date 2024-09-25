import helmet from "helmet";

export const contentSecurityPolicy = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Explicitly set to 'self'
    imgSrc: ["'self'", "data:", "http://localhost:3000"], // Ensure trusted sources are included
    scriptSrc: ["'self'"], // Allow scripts only from 'self'
  },
});
