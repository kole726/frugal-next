import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frugal Next.js App",
  description: "A simple Next.js app for testing deployment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
