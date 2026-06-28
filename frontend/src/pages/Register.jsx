import { useState } from "react";
import { registerUser } from "../api";

export default function Register({ onNavigate, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({
        name,
        email,
        password,
        points: 0,
        reportsCount: 0,
      });
      onLogin(res.data);
      onNavigate("home");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-sky-50 border border-sky-200 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Welcome, Hero 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Create your profile to start reporting issues.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-white border border-sky-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full bg-white border border-sky-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!name || !email || !password || loading}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-100 disabled:text-slate-400 text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? "Creating account..." : "Continue →"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="text-sky-500 hover:text-sky-600 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}