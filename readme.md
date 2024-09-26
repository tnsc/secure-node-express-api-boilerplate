## Security as a top priority

This project employs a robust security middleware setup to protect against various vulnerabilities and enhance the security of the application. The middleware utilizes [`helmet`](https://helmetjs.github.io/) alongside custom configurations to ensure maximum protection.

### Key Security Features:

1. **Content Security Policy (CSP)**:

   - Controls the resources the browser is allowed to load for your page.
   - Default configuration allows resources only from the same origin (`'self'`) and localhost for images, and restricts script execution to the same origin.
   - Customizable through the `securityMiddleware` in the code.
   - Example settings:
     ```javascript
     directives: {
       defaultSrc: ["'self'"],
       imgSrc: ["'self'", "data:", "http://localhost:3000"],
       scriptSrc: ["'self'"],
     }
     ```

2. **X-Frame-Options**:

   - Prevents clickjacking attacks by not allowing the site to be embedded in frames.
   - Configured to `DENY` all frame embedding.

3. **HTTP Strict Transport Security (HSTS)**:

   - Forces the browser to use HTTPS connections to your server for a specified period (max-age of 1 year).
   - Includes subdomains and is configured for preload lists.

4. **XSS Protection**:

   - Enables Cross-Site Scripting (XSS) filtering in browsers.
   - Helps prevent malicious scripts from being injected into your site.

5. **DNS Prefetch Control**:

   - Controls whether the browser should perform DNS prefetching of external resources.
   - Prefetching is disabled for third-party content by default.

6. **Referrer Policy**:

   - Configures how much information is sent along with the `Referer` header in requests.
   - Set to `no-referrer`, ensuring that no referrer data is leaked to third-party sites.

7. **MIME Sniffing Protection**:

   - Prevents MIME-type sniffing by setting the `X-Content-Type-Options` header to `nosniff`.

8. **Permissions-Policy**:

   - Controls which browser features (e.g., geolocation, microphone, camera) can be used on your site.
   - Example configuration:
     ```javascript
     "geolocation=(), microphone=(), camera=(), fullscreen=(self)";
     ```

9. **Cross-Origin-Embedder-Policy (COEP)**:

   - Ensures that your site does not load cross-origin resources without explicit permission (via the `require-corp` setting).

10. **Cross-Origin-Resource-Policy (CORP)**:

    - Prevents cross-origin resource sharing from unauthorized origins by restricting resource access to the same origin (`same-origin`).

11. **Secure Cookies**:

    - Cookies are configured with the following properties:
      - `HttpOnly`: Prevents JavaScript from accessing cookies.
      - `SameSite=Strict`: Limits cookies to be sent only in same-site requests.
      - `Secure`: Ensures cookies are sent over HTTPS (enabled in production).

12. **Additional Headers**:
    - **X-DNS-Prefetch-Control**: Controls whether DNS prefetching is allowed.
    - **X-Powered-By**: Removed to hide information about the underlying technology stack.
    - **X-XSS-Protection**: Ensures browsers block detected XSS attacks by setting the value to `1; mode=block`.

### Adding Security Headers in Code:

The custom security middleware is defined as an array of middleware functions in the `securityMiddleware` module. Below is an example from the code that showcases how these headers are configured:

```typescript
import helmet from "helmet";
import cookieParser from "cookie-parser";

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "http://localhost:3000"],
        scriptSrc: ["'self'"],
      },
    },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    dnsPrefetchControl: { allow: false },
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
  }),
  (_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  },
  (_req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
  },
  (_req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), fullscreen=(self)"
    );
    next();
  },
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  },
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    next();
  },
  cookieParser(),
  (_req, res, next) => {
    res.cookie("session_id", "some-session-value", {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });
    next();
  },
];
```

### Running the Application with Security Middleware:

The security middleware is applied to the Express application in `app.ts` as follows:

```
import { securityMiddleware } from "./middleware/security";

app.use(
  helmet({
    contentSecurityPolicy: false, // Disables default CSP to allow custom CSP
  })
);

app.use(securityMiddleware);
```

This setup ensures that the application is protected against common web vulnerabilities and uses secure practices for cookie handling, cross-origin resource protection, and other security measures.
