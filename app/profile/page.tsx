'use client';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  return (
    <div className="flex flex-col h-full items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col gap-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Settings</h2>
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left ${activeTab === 'general' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            General Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left ${activeTab === 'security' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Security & Password
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-8 md:p-12">
          {activeTab === 'general' && (
            <div className="max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Profile</h1>
              <p className="text-sm text-slate-500 mb-8">Manage your general account information.</p>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl border-4 border-white shadow-sm">
                  JD
                </div>
                <div>
                  <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                    Upload new photo
                  </button>
                  <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="fname">Full Name</label>
                  <input 
                    type="text" 
                    id="fname" 
                    defaultValue="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="pemail">Email Address</label>
                  <input 
                    type="email" 
                    id="pemail" 
                    defaultValue="john.doe@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Update Password</h1>
              <p className="text-sm text-slate-500 mb-8">Ensure your account is using a long, random password to stay secure.</p>
              
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="current">Current Password</label>
                  <input 
                    type="password" 
                    id="current" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="new">New Password</label>
                  <input 
                    type="password" 
                    id="new" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  />
                  <p className="text-xs text-slate-400 mt-2">Minimum 8 characters. Must include numbers and symbols.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="confirm">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirm" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
