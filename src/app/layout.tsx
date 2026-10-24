import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#FBF9F5',
};

export const metadata: Metadata = {
  title: 'Desla! — Thoughtful Skincare for Melanin-Rich Skin',
  description:
    'Discover products, everyday routines, and a beauty community built around your needs. Join the Desla! pre-launch waitlist for launch updates.',
  icons: {
    icon: [
      { url: '/desla-logo.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/desla-logo.png',
    apple: '/desla-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" href="/desla-logo.png" />
        <link rel="shortcut icon" type="image/png" href="/desla-logo.png" />
        <link rel="apple-touch-icon" href="/desla-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="bg-[#FBF9F5] text-[#111112] antialiased selection:bg-[#B89248]/20 selection:text-[#111112] min-h-[100dvh]"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
