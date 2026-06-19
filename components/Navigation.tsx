'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const linkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `transition-colors cursor-pointer ${isActive ? 'text-indigo-600 font-bold' : 'hover:text-slate-900 font-medium text-slate-500'}`;
  };

  return (
    <header className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold transform rotate-3">
            <svg className="w-5 h-5 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-800">Abhi Tools Hub</span>
        </Link>
        <nav className="ml-8 hidden md:flex gap-6 text-sm">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <div className="relative group">
            <Link href="/pdf-tools" className={`flex items-center gap-1 ${linkClass('/pdf-tools')}`}>
              PDF Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </Link>
            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
               <Link href="/pdf-tools" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium border-b border-slate-100">Merge PDF</Link>
               <Link href="/split-pdf" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Split PDF</Link>
            </div>
          </div>
          <Link href="/image-tools" className={linkClass('/image-tools')}>Image Tools</Link>
          <Link href="/converters" className={linkClass('/converters')}>Converters</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/profile" className="hidden sm:flex text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors items-center gap-2 mr-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Profile
        </Link>
        <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
        <Link href="/register" className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">Get Started</Link>
      </div>
    </header>
  );
}
