import { useCallback } from "react";

import { authClient } from "@/lib/auth-client";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export function useCurrentUser(): {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} {
  // better-auth/react clients expose reactive hooks/atoms.
  // We rely on the session hook to reflect cookie-backed auth state.
  const session = authClient.useSession();

  const isLoading = session?.isPending === true;
  const user = session?.data?.user
    ? {
        id: session.data.user.id,
        name: session.data.user.name,
        email: session.data.user.email,
        image: session.data.user.image,
      }
    : null;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

export function useAuth() {
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  const signOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw new Error(result.error.message || "Sign in failed");
    }
    return result;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      throw new Error(result.error.message || "Sign up failed");
    }
    return result;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
