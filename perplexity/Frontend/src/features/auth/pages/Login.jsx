import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const { handleLogin } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      email,
      password
    }

    await handleLogin(payload)
    navigate("/")
  }

  if(!loading && user){
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#1D7F86]">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-white">Sign in to your account</h1>
          <p className="mt-3 text-sm text-slate-400">
            Enter your details to continue.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-email">
              Email
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#1D7F86] focus:ring-2 focus:ring-[#1D7F86]/30"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-password">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#1D7F86] focus:ring-2 focus:ring-[#1D7F86]/30"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>

          <button
            className="w-full rounded-lg bg-[#1D7F86] px-4 py-3 font-semibold text-white transition hover:bg-[#2499a1] focus:outline-none focus:ring-2 focus:ring-[#1D7F86] focus:ring-offset-2 focus:ring-offset-slate-900"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-[#1D7F86] hover:text-[#2499a1]" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
