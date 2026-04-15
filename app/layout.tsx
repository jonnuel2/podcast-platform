"use client";

import "./globals.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AptosWalletAdapterProvider>
          {children}
        </AptosWalletAdapterProvider>
      </body>
    </html>
  );
}