import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function SigninPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const redirectTo = useMemo(() => {
    return redirectParam || location.state?.from || "/money-tracker";
  }, [redirectParam, location.state]);

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // const token = localStorage.getItem("auth_token");
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  function validate() {
    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) return setErr(v);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      if (!res.ok) {
        const msg = await safeJson(res);
        throw new Error(msg?.message || "Log in failed");
      }
      const data = await res.json();
    //   localStorage.setItem("auth_token", data.accessToken);
    //   if (form.remember && data.refreshToken) {
    //     localStorage.setItem("refresh_token", data.refreshToken);
    //   } else {
    //     localStorage.removeItem("refresh_token");
    //   }
    //   if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    //   navigate(redirectTo, { replace: true });
    // } catch (error) {
    //   setErr(error.message || "Something went wrong");
    // } finally {
    //   setLoading(false);
    // }
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
          {/* <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <div
                className="w-full h-full rounded-xl"
                style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #172A3A 100%)" }}
              />
            </div>
            <span className="text-xl font-semibold text-[#0D1B2A] group-hover:opacity-90">CapitalCompass</span>
          </Link> */}
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Log in to your account</h1>
          <p className="mt-1 text-sm text-slate-600">Welcome back! Track your finances seamlessly.</p>
        </div>

        {err ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Password</span>
              <Link to="/forgot-password" className="text-xs text-[#00A7A7] hover:opacity-90">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
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
                {showPwd ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.65A3 3 0 0012 15a3 3 0 002.35-1.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10-3a3 3 0 110 6 3 3 0 010-6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[#00A7A7] focus:ring-[#00A7A7]"
              checked={form.remember}
              onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
            />
            <span className="text-xs text-slate-600">Remember me on this device</span>
          </label>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-[#00A7A7] text-white text-sm hover:bg-[#009090] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/40 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-600 text-center">
          Don’t have an account?{" "}
          <Link
            to={`/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
            className="text-[#00A7A7] hover:opacity-90"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
