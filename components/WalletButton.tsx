"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

export function WalletButton() {
  const { connected, account, disconnect } = useWallet();

  if (connected && account) {
    const addressString = account.address.toString();
    
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
          {addressString.slice(0, 6)}...{addressString.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <WalletSelector />
  );
}