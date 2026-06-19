import React from 'react';

export function PRDSpec() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12">
       <div className="prose prose-slate max-w-none">
         <h1 className="text-3xl font-bold tracking-tight mb-2">Merge PDF Tool — Product Requirement & Technical Specification</h1>
         <p className="text-slate-500"><strong>Category:</strong> PDF Tool | <strong>Platform:</strong> Online Tools Platform | <strong>Status:</strong> Production-Ready</p>
         <hr className="my-8" />
         
         <h2 className="text-gray-900">1. Executive Summary</h2>
         <h3>Purpose</h3>
         <p>The Merge PDF tool lets a user combine two or more PDF files (and optionally individual pages) into a single, correctly ordered PDF, entirely in the browser flow with server-side processing.</p>
         <h3>Business Value</h3>
         <ul>
           <li><strong>Top-of-funnel acquisition:</strong> "merge pdf" is a multi-million monthly-search keyword.</li>
           <li><strong>Cross-tool conversion:</strong> Users who merge frequently need split, compress, sign, and convert.</li>
         </ul>

         <h2 className="text-gray-900 mt-8">2. User Personas</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <h4 className="font-bold mb-2">Casual User ("Priya, student")</h4>
             <p className="text-sm text-slate-600">Merge a few lecture PDFs quickly, on phone or laptop, for free. Drag files, tap merge, download under a minute.</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <h4 className="font-bold mb-2">Business User ("Rahul, ops manager")</h4>
             <p className="text-sm text-slate-600">Combine monthly invoices/contracts reliably. Needs correct page order, predictable merge, trusting that files are handled securely and purged.</p>
           </div>
         </div>

         <h2 className="text-gray-900">3. Functional Requirements</h2>
         <h3>Core Features (MVP)</h3>
         <ol>
           <li>Upload 2+ PDF files (multi-select + drag-and-drop).</li>
           <li>Display ordered list of uploaded files with name, size, page count, thumbnail.</li>
           <li>Reorder files (drag handle / up-down).</li>
           <li>Remove a file from the set before merging.</li>
           <li>Merge into a single PDF, server-side.</li>
           <li>Download result; auto-delete temp files after TTL.</li>
         </ol>

         <h2 className="text-gray-900">4. User Flow</h2>
         <pre className="bg-slate-900 text-slate-50 rounded-2xl p-4 overflow-x-auto text-sm">
{`Landing Page → Upload File(s) → Validation → Reorder/Configure
   → Processing (Celery) → Result Generation → Download → Auto-delete`}
         </pre>

         <h2 className="text-gray-900">7. Database Design (PostgreSQL)</h2>
         <pre className="bg-slate-900 text-slate-50 rounded-2xl p-4 overflow-x-auto text-xs">
{`CREATE TABLE tool_jobs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    tool_slug     VARCHAR(64)  NOT NULL DEFAULT 'merge-pdf',
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending',
    config        JSONB        NOT NULL DEFAULT '{}'::jsonb,
    ip_hash       VARCHAR(64),
    expires_at    TIMESTAMPTZ  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);`}
         </pre>

         <h2 className="text-gray-900">10. Backend Architecture</h2>
         <table className="w-full text-left not-prose mb-8">
            <thead className="bg-slate-100 border-b border-slate-200">
               <tr>
                  <th className="p-3 text-sm font-semibold rounded-tl-xl">Layer</th>
                  <th className="p-3 text-sm font-semibold rounded-tr-xl">Responsibility</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
               <tr>
                  <td className="p-3 font-semibold">Views (DRF)</td>
                  <td className="p-3 text-slate-600">HTTP boundary: parse request, set throttle, shape responses.</td>
               </tr>
               <tr>
                  <td className="p-3 font-semibold">Services</td>
                  <td className="p-3 text-slate-600">Core logic: ValidationService, MergeService, StorageService.</td>
               </tr>
               <tr>
                  <td className="p-3 font-semibold">Celery Tasks</td>
                  <td className="p-3 text-slate-600">Runs heavy merge off the request cycle; handles retries.</td>
               </tr>
            </tbody>
         </table>

         <p className="text-sm text-slate-500 italic mt-8 text-center pt-8 border-t border-slate-100">End of Technical Specification Viewer</p>
       </div>
    </div>
  )
}
