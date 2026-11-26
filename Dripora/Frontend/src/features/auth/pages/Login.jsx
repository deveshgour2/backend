import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email: form.email, password: form.password });
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">

      {/* ── LEFT: Full-height image panel (desktop only) ── */}
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&q=85&fit=crop"
          alt="Dripora fashion"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Right-side fade into the dark form panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#09090b]" />
        {/* Bottom vignette for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/85 via-[#09090b]/20 to-transparent" />

        {/* Top-left brand */}
        <div className="absolute top-10 left-10 z-10">
          <span
            className="text-xl font-bold tracking-widest uppercase"
            style={{ color: "#F5C518", fontFamily: "Inter, sans-serif" }}
          >
            Dripora.
          </span>
        </div>

        {/* Bottom-left editorial copy */}
        <div className="absolute bottom-12 left-10 z-10 max-w-sm">
          <p
            className="text-5xl font-bold leading-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome{" "}
            <span style={{ color: "#F5C518" }}>back.</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Step back into a world of curated fashion and
            effortless style made just for you.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex flex-1 flex-col justify-center px-8 py-16 lg:px-16 xl:px-20">

        {/* Mobile-only brand */}
        <div className="mb-10 lg:hidden">
          <span
            className="text-2xl font-bold tracking-widest uppercase"
            style={{ color: "#F5C518" }}
          >
            Dripora.
          </span>
        </div>

        {/* Form header */}
        <div className="mb-10">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#F5C518" }}
          >
            Welcome to Dripora
          </p>
          <h2
            className="text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sign In
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 max-w-sm w-full">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-medium text-zinc-500 uppercase tracking-widest"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="hello@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b border-zinc-700 bg-transparent pb-2.5 pt-1 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-zinc-500 uppercase tracking-widest"
              >
                Password
              </label>
           
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b border-zinc-700 bg-transparent pb-2.5 pt-1 pr-8 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1 text-zinc-600 transition-colors hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.147.44-2.24 1.2-3.18M6.343 6.343A9.95 9.95 0 0112 5c5 0 9 4 9 7a9.956 9.956 0 01-4.343 6.657M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                backgroundColor: "#F5C518",
                boxShadow: "0 0 0 0 rgba(245,197,24,0)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 24px 6px rgba(245,197,24,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 0 0 rgba(245,197,24,0)")
              }
            >
              Sign In
            </button>
            <p className="my-2.5 text-center text-xs uppercase tracking-widest text-zinc-500">or</p>

            <ContinueWithGoogle/>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-8 text-sm text-zinc-500 max-w-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium hover:underline"
            style={{ color: "#F5C518" }}
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
