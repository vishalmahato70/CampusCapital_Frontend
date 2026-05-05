import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BASE_URL from "../utils/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // Derive post-signup redirect
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const redirectTo = useMemo(() => {
    return redirectParam || location.state?.from || "/money-tracker";
  }, [redirectParam, location.state]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    accept: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // If already logged in (from context), skip
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  function validate() {
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    if (!form.accept) return "Please accept Terms & Privacy";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      if (!res.ok) {
        const msg = await safeJson(res);
        throw new Error(msg?.message || "Sign up failed");
      }
      const data = await res.json();
      // Use the login function from AuthContext
      login(data.user, data.accessToken);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErr(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Start tracking accounts, income, expenses, and savings.</p>
        </div>

        {err ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Username</span>
            <input
              type="text"
              placeholder="aarav_sharma"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Password</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Confirm password</span>
            <div className="relative">
              <input
                type={showPwd2 ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowPwd2((v) => !v)}
                aria-label={showPwd2 ? "Hide password" : "Show password"}
              >
                {showPwd2 ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[#00A7A7] focus:ring-[#00A7A7]"
              checked={form.accept}
              onChange={(e) => setForm((f) => ({ ...f, accept: e.target.checked }))}
              required
            />
            <span className="text-xs text-slate-600">
              I accept the Terms and Privacy Policy
            </span>
          </label>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-[#00A7A7] text-white text-sm hover:bg-[#009090] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/40 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-600 text-center">
          Already have an account?{" "}
          <Link
            to={`/signin${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
            className="text-[#00A7A7] hover:opacity-90"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10-3a3 3 0 110 6 3 3 0 010-6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.88 5.52A10.8 10.8 0 0112 5c5.52 0 9 5 9 7 0 .55-.28 1.28-.86 2.12M14.35 13.75A3 3 0 0112 15a3 3 0 01-3-3c0-.53.14-1.02.4-1.45" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
