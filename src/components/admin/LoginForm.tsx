"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { setStoredToken } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      const isHttps =
        typeof window !== "undefined" && window.location.protocol === "https:";
      document.cookie = `admin_session=true; path=/; max-age=345600; SameSite=Lax${
        isHttps ? "; Secure" : ""
      }`;

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
    >

      <div className="space-y-5">

        <div>
          <label className="form-label">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="admin@dwellora.com"
            className="form-input"
            required
          />
        </div>


        <div>
          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter password"
            className="form-input"
            required
          />
        </div>


        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}


        <button
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

    </form>
  );
}