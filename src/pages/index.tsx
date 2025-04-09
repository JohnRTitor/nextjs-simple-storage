"use client"; // Enables client-side rendering for this component

import Head from "next/head";
import CommonHeader from "@/components/Header";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "@wagmi/connectors";
import SimpleStorageSection from "@/components/SimpleStorageSection";

export default function Home() {
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask is installed on the user's browser
  useEffect(() => {
    /**
     * Check for MetaMask client-side only.
     * In Next.js, "window" is not available during Server-Side Rendering (SSR),
     * so we must wrap it inside a useEffect (which only runs on the client).
     */
    if (typeof window !== "undefined" && window.ethereum) {
      setHasMetaMask(true);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Head metadata for the page */}
      <Head>
        <title>Simple Storage Contract Demo!</title>
        <meta name="description" content="Demo for interacting with the SimpleStorage contract" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Reusable header component */}
      <CommonHeader />

      {/* Wallet connection section */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <WalletSection hasMetaMask={hasMetaMask} />
      </main>
    </div>
  );
}

// Component to handle wallet connection and display wallet info
function WalletSection({ hasMetaMask }: { hasMetaMask: boolean }) {
  const { connect } = useConnect(); // Hook to connect wallet
  const { address, isConnected } = useAccount(); // Access account info
  const { disconnect } = useDisconnect(); // Hook to disconnect wallet
  const { data: balance } = useBalance({ address }); // Get wallet balance

  // Case: MetaMask not installed
  if (!hasMetaMask) {
    return (
      <InfoCard>
        <p>MetaMask is not available.</p>
        <p>Please install MetaMask to continue.</p>
      </InfoCard>
    );
  }

  // Case: MetaMask is installed but wallet is not connected
  if (!isConnected) {
    return (
      <InfoCard>
        <p>Connect your wallet to continue.</p>
        <br />
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      </InfoCard>
    );
  }

  // Case: Wallet is connected
  return (
    <>
      <InfoCard>
        <p>Connected to {address}</p>
        <p className="text-gray-400 mb-4">
          Balance:{" "}
          <span className="font-semibold">
            {balance?.formatted} {balance?.symbol || "Loading..."}
          </span>
        </p>
        <br />
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Disconnect Wallet
        </button>
      </InfoCard>
      <SimpleStorageSection />
    </>
  );
}

// Reusable styled container for wallet messages
function InfoCard({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border rounded-md max-w-md mx-auto text-center">{children}</div>;
}
