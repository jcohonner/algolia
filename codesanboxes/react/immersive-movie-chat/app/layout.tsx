import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Immersive Movie Chat',
  description: 'Un chat immersif pour trouver des films a regarder.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
