import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="w-full flex items-center justify-between p-4 bg-gray-800 text-white fixed top-0">
          <h1 className="text-xl">Shane Kanterman's Portfolio</h1>
          <img
            src="/pp.jpeg"
            alt="Shane Kanterman"
            className="rounded-full h-18 w-18"
          />
        </header>
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
