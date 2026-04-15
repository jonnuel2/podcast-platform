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
          plugins={wallets}
          autoConnect={true}
          dappConfig={{
            network: Network.MAINNET,
          }}
        >
          {children}
        </AptosWalletAdapterProvider>
      </body>
    </html>
  );
}