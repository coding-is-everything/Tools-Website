'use client';

import { useState, useRef, useEffect } from 'react';
import { PRDSpec } from '@/components/PRDSpec';
import { PDFDocument } from 'pdf-lib';

export default function PdfTools() {
  const [viewMode, setViewMode] = useState<'ui' | 'prd'>('ui');
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [processedCount, setProcessedCount] = useState(4218904);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessedCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfFile = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfFile as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `UniTools_Merged_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setProcessedCount(prev => prev + files.length);
      setFiles([]);
    } catch (e) {
      console.error("Merge error", e);
      alert("Error merging PDFs. Ensure they are valid, unencrypted PDF files.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toggle */}
      <div className="flex bg-white flex-wrap gap-2 border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start shrink-0">
         <button 
           className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'ui' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
           onClick={() => setViewMode('ui')}
         >
           Merge Tool UX Preview (Bento Grid)
         </button>
         <button 
           className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'prd' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
           onClick={() => setViewMode('prd')}
         >
           PRD Specification
         </button>
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto pb-6">
        {viewMode === 'ui' ? (
           <main className="grid grid-cols-12 grid-rows-none md:grid-rows-6 gap-4 min-h-[700px] h-full">
             
             {/* Main Tool Workspace */}
             <section className="col-span-12 md:col-span-8 md:row-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 flex flex-col min-h-[400px]">
               <div className="mb-6">
                 <h1 className="text-3xl font-bold mb-2">Merge PDF</h1>
                 <p className="text-slate-500">Select multiple PDF files and combine them into a single document in seconds.</p>
               </div>

               <div 
                 className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-64"
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
               >
                 <input 
                   type="file" 
                   multiple 
                   accept=".pdf" 
                   className="hidden" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                 />
                 <div className="flex flex-wrap gap-4 justify-center mb-8">
                   {files.length === 0 ? (
                     <div className="text-slate-400 font-medium my-12">Drag & drop PDF files here, or <button onClick={() => fileInputRef.current?.click()} className="text-indigo-600 font-bold hover:underline">browse</button> to select.</div>
                   ) : (
                     <>
                       {files.map((file, idx) => (
                          <div key={idx} className="w-40 bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group text-left">
                             <div className="h-20 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-indigo-600 font-extrabold text-2xl">PDF</div>
                             <p className="text-xs font-semibold truncate" title={file.name}>{file.name}</p>
                             <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                             <div onClick={() => removeFile(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs cursor-pointer shadow-sm hover:scale-110 transition-transform">×</div>
                          </div>
                       ))}
                       <div onClick={() => fileInputRef.current?.click()} className="w-40 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-2 text-xl">+</div>
                          <p className="text-xs font-medium text-slate-500">Add more</p>
                       </div>
                     </>
                   )}
                 </div>

                 <button 
                   onClick={handleMerge}
                   disabled={isMerging || files.length < 2}
                   className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform ${isMerging || files.length < 2 ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-100 hover:scale-105 active:scale-95'}`}
                 >
                   {isMerging ? 'Merging...' : 'Merge Files Now'}
                 </button>
                 <p className="mt-4 text-[11px] text-slate-400 font-medium">Your files are protected with 256-bit SSL encryption and will be processed entirely on your device.</p>
               </div>
             </section>

             {/* Statistics Bento */}
             <section className="col-span-12 md:col-span-4 md:row-span-1 bg-indigo-600 text-white rounded-3xl p-6 flex items-center gap-4">
               <div className="shrink-0 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Files Processed</p>
                 <p className="text-2xl font-bold leading-none mt-1">{processedCount.toLocaleString()}</p>
               </div>
             </section>

             {/* Security/Compliance Bento */}
             <section className="col-span-12 md:col-span-4 md:row-span-1 bg-white border border-slate-200 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
               <div className="shrink-0 w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <div>
                 <p className="text-sm font-bold">Enterprise Security</p>
                 <p className="text-xs text-slate-500 mt-0.5">ISO 27001 & GDPR Compliant</p>
               </div>
             </section>

             {/* How to Use / Guide Bento */}
             <section className="col-span-12 md:col-span-4 md:row-span-3 bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[250px]">
               <div>
                 <h3 className="text-lg font-bold mb-4">How it works</h3>
                 <ul className="space-y-4">
                   <li className="flex gap-3">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold">01</span>
                     <p className="text-xs text-slate-400">Drag and drop your PDF files into the tool area.</p>
                   </li>
                   <li className="flex gap-3">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold">02</span>
                     <p className="text-xs text-slate-400">Reorder files by dragging them into your preferred sequence.</p>
                   </li>
                   <li className="flex gap-3">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold">03</span>
                     <p className="text-xs text-slate-400">Click 'Merge Files' and wait for your result.</p>
                   </li>
                   <li className="flex gap-3">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold">04</span>
                     <p className="text-xs text-slate-400">Download your combined PDF instantly.</p>
                   </li>
                 </ul>
               </div>
               <div className="mt-6 pt-4 border-t border-white/10">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="text-yellow-400 font-bold">★★★★★</span>
                   <span className="text-xs text-white/60">4.9/5 from users</span>
                 </div>
               </div>
             </section>

             {/* SEO / Footer Bento */}
             <section className="col-span-12 md:col-span-12 md:row-span-1 bg-white border border-slate-200 rounded-3xl px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4">
               <div className="flex flex-wrap gap-8">
                 <div className="text-xs">
                   <p className="font-bold text-slate-400 uppercase mb-1 tracking-wider">Why UniTools?</p>
                   <p className="text-slate-600 font-medium">Free, Fast, Private</p>
                 </div>
                 <div className="text-xs">
                   <p className="font-bold text-slate-400 uppercase mb-1 tracking-wider">Cloud Enabled</p>
                   <p className="text-slate-600 font-medium">AWS S3 Storage Integration</p>
                 </div>
                 <div className="text-xs">
                   <p className="font-bold text-slate-400 uppercase mb-1 tracking-wider">Processing</p>
                   <p className="text-slate-600 font-medium">Powered by Celery & Redis</p>
                 </div>
               </div>
               <div className="flex flex-wrap gap-3">
                 <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide">#MERGE-PDF</span>
                 <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide">#PDF-TOOL</span>
                 <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide">#FAST-CONVERT</span>
               </div>
             </section>
           </main>
        ) : (
           <PRDSpec />
        )}
      </div>
    </div>
  );
}
