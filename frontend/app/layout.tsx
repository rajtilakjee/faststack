import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Suspense } from "react";

import { AuthenticatedShell } from "@/components/authenticated-shell";
import { AuthShellFallback } from "@/components/auth-shell-fallback";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastStack",
  description: "FastAPI + uv + Next.js starter template",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<AuthShellFallback>{children}</AuthShellFallback>}>
          <AuthenticatedShell>{children}</AuthenticatedShell>
        </Suspense>
      </body>
    </html>
  );
}
