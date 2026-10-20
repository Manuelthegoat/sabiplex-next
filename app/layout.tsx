import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sabiplex | Learn without limits",
  description: "A modern learning platform for ambitious people.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <ToastProvider />
        <ConfettiProvider />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
