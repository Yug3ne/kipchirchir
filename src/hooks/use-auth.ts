/**
 * Auth Hook - Simple localStorage-based auth state
 *
 * No useEffect needed - localStorage is synchronous!
 */

import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { useCallback, useSyncExternalStore } from "react";

// Storage key for auth state
const AUTH_STORAGE_KEY = "kipchirchir_auth_user";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

// Cache for stable references (required by useSyncExternalStore)
let cachedUser: StoredUser | null = null;
let cachedRaw: string | null = null;

// Store user in localStorage
export function storeUser(user: StoredUser) {
  const json = JSON.stringify(user);
  localStorage.setItem(AUTH_STORAGE_KEY, json);
  // Update cache
  cachedRaw = json;
  cachedUser = user;
  // Notify subscribers
  window.dispatchEvent(new Event("auth-change"));
}

// Clear stored user
export function clearStoredUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedRaw = null;
  cachedUser = null;
  window.dispatchEvent(new Event("auth-change"));
}

// Get user from localStorage with caching for stable references
function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    // Return cached value if raw string hasn't changed
    if (raw === cachedRaw) {
      return cachedUser;
    }
    // Parse and cache new value
    cachedRaw = raw;
    cachedUser = raw ? JSON.parse(raw) : null;
    return cachedUser;
  } catch {
    cachedRaw = null;
    cachedUser = null;
    return null;
  }
}

// Subscribe to auth changes
function subscribeToAuth(callback: () => void) {
  window.addEventListener("auth-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("auth-change", callback);
    window.removeEventListener("storage", callback);
  };
}

// Get current user - uses useSyncExternalStore for reactivity without useEffect
export function useCurrentUser() {
  const user = useSyncExternalStore(
    subscribeToAuth,
    getStoredUser,
    () => null // Server snapshot
  );

  return {
    user,
    isLoading: false, // localStorage is synchronous, no loading state needed
    isAuthenticated: !!user,
  };
}

// Auth actions
export function useAuth() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  const signOut = useCallback(async () => {
    clearStoredUser();
    try {
      await authClient.signOut();
    } catch {
      // Ignore errors, we've already cleared local state
    }
    navigate("/login");
  }, [navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw new Error(result.error.message || "Sign in failed");
    }
    return result;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.error) {
        throw new Error(result.error.message || "Sign up failed");
      }
      return result;
    },
    []
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
