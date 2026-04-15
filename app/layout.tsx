"use client";

import "./globals.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";

const wallets = [new PetraWallet()];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AptosWalletAdapterProvider
          wallets={wallets}
          autoConnect={true}
          onError={(error) => {
            console.log("Wallet error:", error);
          }}
        >
          {children}
        </AptosWalletAdapterProvider>
      </body>
    </html>
  );
}