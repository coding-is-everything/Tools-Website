import Link from 'next/link';

export default function Home() {
  return (
    <main className="grid grid-cols-12 grid-rows-6 gap-4 flex-grow min-h-0 overflow-y-auto pb-6">
      {/* Welcome Bento */}
      <section className="col-span-12 md:col-span-8 row-span-6 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12 flex flex-col justify-center items-start relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight z-10 leading-tight">All your documents,<br/>mastered in one place.</h1>
         <p className="text-lg text-slate-500 mb-10 max-w-xl z-10">Abhi Tools Hub provides a professional suite of utilities to merge PDFs, convert files, and edit images rapidly and securely entirely in your browser.</p>
         <Link href="/pdf-tools" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-transform z-10 inline-flex">
           Explore PDF Tools
         </Link>
      </section>

      {/* PDF Tools Link */}
      <Link href="/pdf-tools" className="col-span-12 md:col-span-4 row-span-2 bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl group hover:scale-[1.02] transition-transform">
         <div>
           <h3 className="text-xl font-bold tracking-tight">PDF Tools</h3>
           <p className="text-slate-400 text-sm mt-2">Merge, Compress, Split, and Sign PDFs seamlessly in your browser within seconds.</p>
         </div>
         <div className="text-indigo-400 font-semibold text-sm group-hover:text-indigo-300">View tools &rarr;</div>
      </Link>

      {/* Image Tools Link */}
      <Link href="/image-tools" className="col-span-12 md:col-span-4 row-span-2 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm group hover:scale-[1.02] transition-transform">
         <div>
           <h3 className="text-xl font-bold text-slate-900 tracking-tight">Image Tools</h3>
           <p className="text-slate-500 text-sm mt-2">Resize, crop, and convert JPGs, PNGs, and WebP images instantly.</p>
         </div>
         <div className="text-indigo-600 font-semibold text-sm">View tools &rarr;</div>
      </Link>

      {/* Converters Link */}
      <Link href="/converters" className="col-span-12 md:col-span-4 row-span-2 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm group hover:scale-[1.02] transition-transform">
         <div>
           <h3 className="text-xl font-bold text-indigo-900 tracking-tight">Converters</h3>
           <p className="text-indigo-700/80 text-sm mt-2">Convert Office documents to PDF and vice versa with precision.</p>
         </div>
         <div className="text-indigo-700 font-semibold text-sm">View tools &rarr;</div>
      </Link>
    </main>
  );
}
