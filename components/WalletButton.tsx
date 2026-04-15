"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

export function WalletButton() {
  const { connected, account, disconnect } = useWallet();

  if (connected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
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