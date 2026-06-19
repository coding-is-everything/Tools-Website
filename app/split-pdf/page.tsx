'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import Link from 'next/link';

type SplitMode = 'ranges' | 'every_n' | 'burst';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [splitMode, setSplitMode] = useState<SplitMode>('ranges');
  const [rangesStr, setRangesStr] = useState<string>('1-2, 3-4');
  const [everyN, setEveryN] = useState<number>(2);

  const [results, setResults] = useState<{name: string, blob: Blob}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResults([]);
      
      // Get page count preview
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        setPageCount(pdfDoc.getPageCount());
      } catch (err) {
        console.error("Could not read PDF to get page count", err);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setResults([]);
        try {
          const arrayBuffer = await droppedFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          setPageCount(pdfDoc.getPageCount());
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const parseRanges = (str: string, maxPages: number): [number, number][] => {
    const parts = str.split(',').map(s => s.trim()).filter(Boolean);
    const rangesToExtract: [number, number][] = [];
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim(), 10));
        const s = isNaN(start) ? 1 : Math.max(1, start);
        const e = isNaN(end) ? maxPages : Math.min(maxPages, end);
        if (s <= e) rangesToExtract.push([s, e]);
      } else {
        const val = parseInt(part, 10);
        if (!isNaN(val) && val >= 1 && val <= maxPages) {
          rangesToExtract.push([val, val]);
        }
      }
    }
    return rangesToExtract;
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const outputParts: {name: string, blob: Blob}[] = [];
      const totalPages = pdfDoc.getPageCount();

      if (splitMode === 'ranges') {
        const parsed = parseRanges(rangesStr, totalPages);
        for (let i = 0; i < parsed.length; i++) {
          const [start, end] = parsed[i];
          const newPdf = await PDFDocument.create();
          const indices = [];
          for (let p = start; p <= end; p++) indices.push(p - 1); // 0-indexed
          const copiedPages = await newPdf.copyPages(pdfDoc, indices);
          copiedPages.forEach((page) => newPdf.addPage(page));
          const pdfBytes = await newPdf.save();
          outputParts.push({
            name: `${file.name.replace('.pdf', '')}_${start}-${end}.pdf`,
            blob: new Blob([pdfBytes as any], { type: 'application/pdf' })
          });
        }
      } else if (splitMode === 'every_n') {
        const n = Math.max(1, everyN || 1);
        for (let i = 0; i < totalPages; i += n) {
          const start = i + 1;
          const end = Math.min(totalPages, i + n);
          const newPdf = await PDFDocument.create();
          const indices = [];
          for (let p = start; p <= end; p++) indices.push(p - 1);
          const copiedPages = await newPdf.copyPages(pdfDoc, indices);
          copiedPages.forEach((page) => newPdf.addPage(page));
          const pdfBytes = await newPdf.save();
          outputParts.push({
            name: `${file.name.replace('.pdf', '')}_${start}-${end}.pdf`,
            blob: new Blob([pdfBytes as any], { type: 'application/pdf' })
          });
        }
      } else if (splitMode === 'burst') {
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const copiedPages = await newPdf.copyPages(pdfDoc, [i]);
          copiedPages.forEach((page) => newPdf.addPage(page));
          const pdfBytes = await newPdf.save();
          outputParts.push({
            name: `${file.name.replace('.pdf', '')}_page-${i + 1}.pdf`,
            blob: new Blob([pdfBytes as any], { type: 'application/pdf' })
          });
        }
      }

      setResults(outputParts);

    } catch (e) {
      console.error(e);
      alert('Error splitting PDF. Please check the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach((res) => {
      zip.file(res.name, res.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AbhiToolsHub_Split_${new Date().getTime()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-4 max-w-6xl mx-auto w-full p-4">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 flex flex-col min-h-[400px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Split PDF</h1>
          <p className="text-slate-500">Separate one PDF into multiple files. Extract pages or split by range securely in your browser.</p>
        </div>

        {!file && (
          <div 
            className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-64"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
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
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95"
            >
              Browse Files
            </button>
          </div>
        )}

        {file && results.length === 0 && (
          <div className="flex flex-col md:flex-row gap-8 mt-4 animate-in fade-in duration-300">
            {/* File Info */}
            <div className="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                 </div>
                 <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount ? `${pageCount} Pages` : 'Loading...'}</p>
                 </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                 <button 
                   onClick={() => setFile(null)}
                   className="text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors w-full"
                 >
                   Remove
                 </button>
              </div>
            </div>

            {/* Split Settings */}
            <div className="w-full md:w-2/3">
              <h3 className="font-bold text-xl mb-4 text-slate-800">Split Settings</h3>
              
              {/* Mode Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full max-w-md">
                <button 
                  onClick={() => setSplitMode('ranges')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${splitMode === 'ranges' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Custom Ranges
                </button>
                <button 
                  onClick={() => setSplitMode('every_n')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${splitMode === 'every_n' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Fixed Interval
                </button>
                <button 
                  onClick={() => setSplitMode('burst')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${splitMode === 'burst' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Extract All
                </button>
              </div>

              {/* Params Input */}
              <div className="mb-6 min-h-[100px]">
                {splitMode === 'ranges' && (
                  <div className="animate-in fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ranges (e.g. 1-5, 8-10)</label>
                    <input 
                      type="text" 
                      value={rangesStr}
                      onChange={(e) => setRangesStr(e.target.value)}
                      placeholder="1-2, 3-5, 7"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-mono"
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter page ranges separated by commas.</p>
                  </div>
                )}

                {splitMode === 'every_n' && (
                  <div className="animate-in fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Split every N pages</label>
                    <input 
                      type="number" 
                      min="1"
                      max={pageCount || 100}
                      value={Number.isNaN(everyN) ? '' : everyN}
                      onChange={(e) => setEveryN(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-mono"
                    />
                  </div>
                )}

                {splitMode === 'burst' && (
                  <div className="animate-in fade-in">
                    <p className="text-sm text-slate-600 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <strong>Extract All Pages:</strong> This will create a separate PDF file for exactly every single page in your document.
                      You will get {pageCount} files.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                onClick={handleSplit}
                disabled={isProcessing || !pageCount}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Splitting PDF...
                  </>
                ) : (
                  <>Split PDF Document</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results view */}
        {results.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 text-lg">Split Completed!</h3>
                  <p className="text-emerald-700">Your PDF was successfully split into {results.length} files.</p>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={handleDownloadZip}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition"
                  >
                    Download All (ZIP)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
               <h4 className="font-bold text-slate-800">Generated Files</h4>
               <button 
                 onClick={() => { setFile(null); setResults([]); }}
                 className="text-indigo-600 text-sm font-semibold hover:underline"
               >
                 Split Another File
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {results.map((res, index) => (
                 <div key={index} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:border-indigo-300 transition-colors">
                   <div className="flex items-center gap-3 overflow-hidden">
                     <span className="text-red-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                     </span>
                     <div className="overflow-hidden">
                       <p className="text-sm font-bold text-slate-800 truncate" title={res.name}>{res.name}</p>
                       <p className="text-xs text-slate-500">{(res.blob.size / 1024).toFixed(1)} KB</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => {
                        const url = URL.createObjectURL(res.blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = res.name;
                        link.click();
                        URL.revokeObjectURL(url);
                     }}
                     className="text-slate-400 hover:text-indigo-600 p-2"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                   </button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
