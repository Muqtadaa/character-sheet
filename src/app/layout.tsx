import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grimoire — D&D 3.5e Character Sheet Builder',
  description:
    'Build, save, and play D&D 3.5e characters with a real rules engine, homebrew sharing, and live in-session tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
