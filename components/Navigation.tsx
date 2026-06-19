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
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">U</div>
          <span className="font-bold text-xl tracking-tight">UniTools</span>
        </Link>
        <nav className="ml-8 hidden md:flex gap-6 text-sm">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <div className="relative group">
            <Link href="/pdf-tools" className={`flex items-center gap-1 ${linkClass('/pdf-tools')}`}>
              PDF Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </Link>
            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
               <Link href="/pdf-tools" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Merge PDF</Link>
            </div>
          </div>
          <Link href="/image-tools" className={linkClass('/image-tools')}>Image Tools</Link>
          <Link href="/converters" className={linkClass('/converters')}>Converters</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">Get Started</button>
      </div>
    </header>
  );
}
