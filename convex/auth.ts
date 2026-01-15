import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// Build trusted origins list including www and non-www variants
function buildTrustedOrigins(baseUrl: string): string[] {
  const origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    baseUrl,
  ];

  // Add www/non-www variant to handle both cases
  try {
    const url = new URL(baseUrl);
    if (url.hostname.startsWith("www.")) {
      // Add non-www variant
      url.hostname = url.hostname.slice(4);
      origins.push(url.origin);
    } else {
      // Add www variant
      url.hostname = `www.${url.hostname}`;
      origins.push(url.origin);
    }
  } catch {
    // Invalid URL, just use what we have
  }

  return origins;
}

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    // Allow requests from localhost and production (www + non-www)
    trustedOrigins: buildTrustedOrigins(siteUrl),
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
      // Enable cross-domain support for client-side auth with crossDomainClient()
      crossDomain({ siteUrl }),
    ],
  });
};

// Get current authenticated user (returns null if not authenticated)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch {
      // Return null if not authenticated instead of throwing
      return null;
    }
  },
});
