import type {Metadata} from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'UniTools Platform',
  description: 'Merge, Convert, and Edit Files online',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 bg-slate-50 text-slate-900 font-sans p-4 md:p-6 overflow-hidden flex flex-col gap-4" suppressHydrationWarning>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
