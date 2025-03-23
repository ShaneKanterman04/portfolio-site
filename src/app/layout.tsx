import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shane Kanterman -- Software Developer",
  description: "Portfolio for Shane Kanterman",
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
          <Link href="/">
            <h1 className="text-xl">Shane Kanterman&apos;s Portfolio</h1>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="https://github.com/shane-kanterman">
              <Image
                src="/github.svg"
                alt="GitHub"
                className="h-6 w-6"
                width={24}
                height={24}
              />
            </Link>
            <Link href="https://www.linkedin.com/in/shane-kanterman-4511a2234/">
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                className="h-6 w-6"
                width={24}
                height={24}
              />
            </Link>
            <Link href="/admin">
              <Image
                src="/pp.jpeg"
                alt="Shane Kanterman"
                className="rounded-full h-18 w-18"
                width={72}
                height={72}
              />
            </Link>
          </div>
        </header>
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
