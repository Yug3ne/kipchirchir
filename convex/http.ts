import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Production and development origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://kipchirchirkoech.co.ke",
  "https://www.kipchirchirkoech.co.ke",
];

// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins,
  },
});

export default http;
