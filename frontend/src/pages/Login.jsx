import { useState } from "react";
import { loginUser } from "../api";

export default function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email, password });

// Save logged-in user
localStorage.setItem("userEmail", res.data.email);
localStorage.setItem("userName", res.data.name);

onLogin(res.data);

localStorage.setItem("user", JSON.stringify(res.data));
localStorage.setItem("userEmail", res.data.email);

onNavigate("home");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-sky-50 border border-sky-200 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Welcome back 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Login to continue reporting issues.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-sky-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white border border-sky-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!email || !password || loading}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-100 disabled:text-slate-400 text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="text-sky-500 hover:text-sky-600 transition-colors"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}