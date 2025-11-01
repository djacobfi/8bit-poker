import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d6e47',
};

export const metadata: Metadata = {
  title: '8 Bit Poker - Farcaster Mini App',
  description: 'Play Texas Hold\'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!',
  openGraph: {
    title: '8 Bit Poker - Farcaster Mini App',
    description: 'Play Texas Hold\'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '8 Bit Poker',
      },
    ],
  },
  other: {
    'screen-orientation': 'portrait',
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: '/og-image.png',
      button: {
        title: '🎮 Play Poker',
        action: {
          type: 'launch_frame',
          name: '8 Bit Poker',
          url: '/',
          splashImageUrl: '/logo.png',
          splashBackgroundColor: '#0d6e47',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-poker-green text-white antialiased">
        {children}
      </body>
    </html>
  );
}

