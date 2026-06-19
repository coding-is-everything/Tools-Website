export default function ImageTools() {
  return (
    <main className="h-full bg-white border border-slate-200 rounded-3xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-3 tracking-tight">Image Tools</h1>
      <p className="text-slate-500 max-w-sm">Coming soon. Resize, crop, and edit images rapidly within your browser.</p>
    </main>
  );
}
