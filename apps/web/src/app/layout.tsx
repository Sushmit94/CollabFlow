import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CollabFlow',
  description: 'Real-time documents, boards, and presence for collaborative teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
