import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

const Register = () => {

    const {handleRegister} = useAuth()
    const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
        fullName:form.fullName,
        email: form.email,
        contact:form.contactNumber,
        password: form.password,
        isSeller: form.isSeller
    })
    navigate("/")
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#09090b] flex">

      {/* ── LEFT: Full-height image panel (desktop only) ── */}
      <div className="hidden lg:block lg:w-[58%] lg:h-full relative overflow-hidden">
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
            Define your{" "}
            <span style={{ color: "#F5C518" }}>aesthetic.</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-200">
            Join the exclusive movement of creators and brands
            redefining the modern fashion landscape.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex flex-1 flex-col justify-center px-8 py-10 lg:h-full lg:py-6 lg:px-16 xl:px-20">

        {/* Mobile-only brand */}
        <div className="mb-8 lg:hidden">
          <span
            className="text-2xl font-bold tracking-widest uppercase"
            style={{ color: "#F5C518" }}
          >
            Dripora.
          </span>
        </div>

        {/* Form header */}
        <div className="mb-7">
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
            Elevate Your Style
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm w-full">

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border-b border-zinc-700 bg-transparent pb-2.5 pt-1 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518]"
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contactNumber" className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (###) ###-0000"
              value={form.contactNumber}
              onChange={handleChange}
              className="w-full border-b border-zinc-700 bg-transparent pb-2.5 pt-1 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
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
            <label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          {/* isSeller checkbox — inline minimal */}
          <label className="flex cursor-pointer items-center gap-3 select-none">
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                form.isSeller ? "border-[#F5C518] bg-[#F5C518]" : "border-zinc-600 bg-transparent"
              }`}
            >
              <input
                type="checkbox"
                name="isSeller"
                checked={form.isSeller}
                onChange={handleChange}
                className="sr-only"
              />
              {form.isSeller && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-zinc-400">
              Register as Seller
            </span>
          </label>

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
                (e.currentTarget.style.boxShadow = "0 0 24px 6px rgba(245,197,24,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(245,197,24,0)")
              }
            >
              Register
            </button>

            <p className="my-2.5 text-center text-xs uppercase tracking-widest text-zinc-500">or</p>

            <ContinueWithGoogle/>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-5 text-sm text-zinc-500 max-w-sm">
          Already have an A/c?{" "}
          <a href="/login" className="font-medium hover:underline" style={{ color: "#F5C518" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

