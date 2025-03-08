import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Frugal Pharmacy - Find Affordable Medications",
  description: "Compare medication prices across pharmacies and find the most affordable options for your prescriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
