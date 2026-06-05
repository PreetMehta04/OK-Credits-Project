import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import QueryProvider from '@/components/layout/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'SareeAI — Smart Ethnic Wear AI Assistant',
  description: 'Discover your perfect saree with AI-powered recommendations and virtual try-on',
  keywords: 'saree, ethnic wear, AI stylist, virtual try-on, Indian fashion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-slate-950">
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15,23,42,0.9)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
