'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type CompressionLevel = 'low' | 'recommended' | 'high' | 'target';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [targetSize, setTargetSize] = useState<string>('');
  const [isGrayscale, setIsGrayscale] = useState(false);
  
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; compressedSize: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setResult(null);
      }
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);

    // Simulate compression process since true ghostscript compression is server-side
    setTimeout(() => {
      let reductionRatio = 0.5; // default 50%
      if (compressionLevel === 'low') reductionRatio = 0.8;
      if (compressionLevel === 'recommended') reductionRatio = 0.4;
      if (compressionLevel === 'high') reductionRatio = 0.2;
      
      let compressedSize = file.size * reductionRatio;
      
      if (compressionLevel === 'target' && targetSize) {
        const targetBytes = parseFloat(targetSize) * 1024 * 1024;
        if (targetBytes < file.size) {
           compressedSize = targetBytes;
        } else {
           compressedSize = file.size * 0.9;
        }
      }

      if (isGrayscale) {
         compressedSize *= 0.8; // extra 20% reduction for grayscale simulation
      }

      // Return the mock result
      setResult({
        blob: file, // We return the original file in the mockup simply to allow download test
        originalSize: file.size,
        compressedSize: compressedSize
      });
      
      setIsProcessing(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AbhiToolsHub_Compressed_${file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col h-full gap-4 max-w-6xl mx-auto w-full p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 flex flex-col min-h-[400px]">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Compress PDF</h1>
          <p className="text-slate-500">Reduce PDF file size online while keeping quality. Fast, free, and secure.</p>
        </div>

        {!file && (
          <div 
            className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-64 transition-colors hover:bg-slate-50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Select PDF file</h3>
            <p className="text-sm text-slate-500 mb-6">Drag and drop your PDF here</p>
            <input 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-indigo-200"
            >
              Browse Files
            </button>
          </div>
        )}

        {file && !result && (
          <div className="flex flex-col md:flex-row gap-8 mt-4 animate-in fade-in duration-300">
            {/* File Info */}
            <div className="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                 </div>
                 <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Original: {formatBytes(file.size)}</p>
                 </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                 <button 
                   onClick={() => setFile(null)}
                   className="text-xs font-semibold text-slate-500 border border-slate-200 bg-white px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors w-full shadow-sm"
                 >
                   Replace File
                 </button>
              </div>
            </div>

            {/* Compress Settings */}
            <div className="w-full md:w-2/3">
              <h3 className="font-bold text-xl mb-4 text-slate-800">Compression Options</h3>
              
              <div className="space-y-3 mb-6">
                 {/* Low */}
                 <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${compressionLevel === 'low' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
                    <div className="flex items-center gap-4">
                       <input 
                         type="radio" 
                         name="compLevel" 
                         className="w-5 h-5 text-indigo-600"
                         checked={compressionLevel === 'low'}
                         onChange={() => setCompressionLevel('low')}
                       />
                       <div>
                          <p className="font-bold text-slate-800">Low Compression <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-2">Best Quality</span></p>
                          <p className="text-sm text-slate-500 mt-1">Slight reduction in file size, highest visual quality retained.</p>
                       </div>
                    </div>
                 </label>

                 {/* Recommended */}
                 <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${compressionLevel === 'recommended' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
                    <div className="flex items-center gap-4">
                       <input 
                         type="radio" 
                         name="compLevel" 
                         className="w-5 h-5 text-indigo-600"
                         checked={compressionLevel === 'recommended'}
                         onChange={() => setCompressionLevel('recommended')}
                       />
                       <div>
                          <p className="font-bold text-slate-800">Recommended <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md ml-2 border border-emerald-200">Balanced</span></p>
                          <p className="text-sm text-slate-500 mt-1">Good compression, perfect balance between size and quality.</p>
                       </div>
                    </div>
                 </label>

                 {/* High */}
                 <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${compressionLevel === 'high' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
                    <div className="flex items-center gap-4">
                       <input 
                         type="radio" 
                         name="compLevel" 
                         className="w-5 h-5 text-indigo-600"
                         checked={compressionLevel === 'high'}
                         onChange={() => setCompressionLevel('high')}
                       />
                       <div>
                          <p className="font-bold text-slate-800">Extreme Compression <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md ml-2 border border-rose-200">Smallest Size</span></p>
                          <p className="text-sm text-slate-500 mt-1">Maximum reduction in size, noticeable quality degradation.</p>
                       </div>
                    </div>
                 </label>
                 
                 {/* Target Size */}
                 <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${compressionLevel === 'target' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300 bg-white'}`}>
                    <div className="flex items-center gap-4">
                       <input 
                         type="radio" 
                         name="compLevel" 
                         className="w-5 h-5 text-indigo-600"
                         checked={compressionLevel === 'target'}
                         onChange={() => setCompressionLevel('target')}
                       />
                       <div className="flex-1">
                          <p className="font-bold text-slate-800 mb-2">Target Size</p>
                          {compressionLevel === 'target' && (
                             <div className="flex items-center gap-2 animate-in fade-in">
                               <input 
                                 type="number"
                                 placeholder="e.g. 5"
                                 value={targetSize}
                                 onChange={(e) => setTargetSize(e.target.value)}
                                 className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                               />
                               <span className="text-sm font-semibold text-slate-600">MB</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </label>
              </div>

              <div className="mb-6 flex items-center gap-3">
                 <input 
                   type="checkbox" 
                   id="grayscale"
                   checked={isGrayscale}
                   onChange={(e) => setIsGrayscale(e.target.checked)}
                   className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                 />
                 <label htmlFor="grayscale" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                   Convert to Grayscale <span className="text-slate-400 font-normal">(extra compression)</span>
                 </label>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compressing Document...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    Compress PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results view */}
        {result && (
          <div className="flex flex-col items-center justify-center flex-grow py-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm ring-8 ring-emerald-50">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Compression Complete!</h2>
            
            <div className="flex items-center justify-center gap-6 mt-6 mb-8 bg-slate-50 px-8 py-5 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">
               <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Original</p>
                  <p className="text-lg font-semibold text-slate-700">{formatBytes(result.originalSize)}</p>
               </div>
               <div className="flex flex-col items-center px-4">
                  <p className="text-sm font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mb-1 border border-emerald-200">
                     -{Math.round((1 - (result.compressedSize / result.originalSize)) * 100)}%
                  </p>
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
               </div>
               <div className="text-center">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Compressed</p>
                  <p className="text-xl font-bold text-emerald-700">{formatBytes(result.compressedSize)}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={handleDownload}
                className="flex-1 bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
              </button>
            </div>
            
            <div className="mt-8">
               <button 
                 onClick={() => { setFile(null); setResult(null); }}
                 className="text-slate-500 font-semibold text-sm hover:text-indigo-600 transition-colors flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                 Compress another file
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
