"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Enter your name";
    if (!email) newErrors.email = "Enter your email";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Enter a password";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!acceptedTerms) newErrors.terms = "Accept the terms to continue";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Failed to create account");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError("Account created but login failed. Please sign in manually.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#101114] mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Join the leaderboard and claim your product&apos;s rank.
          </p>
        </div>

        <div className="rounded-xl border border-[#E6E4DF] bg-white p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Name
              </label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                error={errors.name}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                error={errors.email}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                  }}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                Confirm password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                error={errors.confirmPassword}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.terms) setErrors((p) => ({ ...p, terms: "" }));
                }}
                className="mt-1 h-4 w-4 rounded border-[#E6E4DF] text-[#FF8A00] focus:ring-[#FF8A00]"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to IndBid&apos;s{" "}
                <Link href="/legal/terms" className="text-[#245BFF] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-[#245BFF] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500">{errors.terms}</p>
            )}

            {authError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            <Button type="submit" variant="saffron" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6E4DF]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#245BFF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
