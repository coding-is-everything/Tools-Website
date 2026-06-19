'use client';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 transform rotate-3">
             <svg className="w-7 h-7 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 text-sm mt-2">Start using Abhi Tools Hub for free</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              required
            />
          </div>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              required
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password"
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-900 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
