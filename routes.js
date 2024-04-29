/** All the routes that are public and can be accessed without authentication should be added here. */
export const publicRoutes = ["/"];

/** All the routes that are protected and can be accessed only after authentication should be added here. */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/** The prefix for API Authentication routes */
export const apiAuthPrefix = "api/auth";

/**  The default redirect path after logging in*/
export const DEFAULT_LOGIN_REDIRECT = "/settings";
