"use client"; // Ensure this component runs on the client side

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors"; // Injected web3 extension connector
import { formatEther } from "viem"; // For formatting ETH balance

export default function CommonHeader() {
  const [hasMetaMask, setHasMetaMask] = useState(false); // Tracks if MetaMask is installed

  // Hook to initiate wallet connection
  const { connect } = useConnect();

  // Hook to get wallet address and connection status
  const { address, isConnected } = useAccount();

  // Hook to disconnect wallet
  const { disconnect } = useDisconnect();

  // Hook to get balance of the connected wallet
  const { data: balance } = useBalance({ address });

  useEffect(() => {
    // Check if MetaMask is available in the browser
    if (typeof window !== "undefined" && window.ethereum) {
      setHasMetaMask(true);
    }
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-4 border-b sticky top-0 bg-white dark:bg-gray-900 dark:text-white z-10 rounded-lg">
      {/* DApp title */}
      <h1 className="text-xl font-bold">Smart Contract Lottery</h1>

      {/* Conditional rendering based on MetaMask and connection status */}
      {!hasMetaMask ? (
        // Prompt to install MetaMask if not available
        <div className="text-sm text-red-500 dark:text-red-400 rounded-full">Install MetaMask</div>
      ) : !isConnected ? (
        // Show connect button if wallet not connected
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Connect Wallet
        </button>
      ) : (
        // Show wallet address, balance, and disconnect button if connected
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px] rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-800">
            {address}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {/* Display ETH balance formatted to 6 decimal places */}
            {balance?.value ? parseFloat(formatEther(balance.value)).toFixed(6) : "0.000000"}{" "}
            {balance?.symbol}
          </span>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
}
