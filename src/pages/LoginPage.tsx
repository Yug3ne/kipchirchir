import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser, storeUser } from "@/hooks/use-auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Invalid credentials");
          setIsLoading(false);
          return;
        }

        // Store user in localStorage for persistence
        if (result.data?.user) {
          storeUser({
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            image: result.data.user.image,
          });
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          setError(result.error.message || "Registration failed");
          setIsLoading(false);
          return;
        }

        // Store user in localStorage for persistence
        if (result.data?.user) {
          storeUser({
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            image: result.data.user.image,
          });
        }
      }

      // Success - navigate to admin
      navigate("/admin");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-linear-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-linear-to-tl from-chart-2/10 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Back to home */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group z-10"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to site</span>
      </Link>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          {/* Logo */}
          <div className="mx-auto">
            <div className="size-16 rounded-2xl bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
              EK
            </div>
          </div>

          {/* Title */}
          <div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Shield className="size-5 text-primary" />
              Admin Access
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "login"
                ? "Sign in to manage your blog"
                : "Create your admin account"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Name (Register only) */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11"
                    required={mode === "register"}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Protected Area
              </span>
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-center text-muted-foreground">
            This is a private admin area for managing blog content.
            <br />
            Unauthorized access is prohibited.
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="fixed bottom-6 text-center text-xs text-muted-foreground z-10">
        © {new Date().getFullYear()} Eugene Kipchirchir
      </div>
    </div>
  );
}

export default LoginPage;
