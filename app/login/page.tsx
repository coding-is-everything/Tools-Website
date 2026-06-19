'use client';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">U</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your details to access your account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
