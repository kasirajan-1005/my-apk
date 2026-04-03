import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading'
});

export const metadata = {
  title: 'DM to Kasi',
  description: 'A real-time direct messaging app with admin controls for Kasi.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
