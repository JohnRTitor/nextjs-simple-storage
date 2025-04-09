"use client"; // Ensures this component is rendered on the client side

import Head from "next/head";
import CommonHeader from "@/components/Header";
import SimpleStorageSection from "@/components/SimpleStorageSection";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Home() {
  // Check if the user is connected to a wallet
  const { isConnected } = useAccount();

  // Track if the component has mounted to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true once the component has mounted
    setIsMounted(true);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Set page metadata */}
      <Head>
        <title>Simple Storage Contract Demo!</title>
        <meta name="description" content="Demo for interacting with the SimpleStorage contract" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header with wallet connect/disconnect button */}
      <CommonHeader />

      {/* Main section of the homepage */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-2xl font-semibold">Welcome to the SimpleStorage DApp</h2>

        {/* Show message or main content depending on connection and mounting status */}
        {!isMounted ? null : !isConnected ? (
          <p className="text-gray-500">Connect your wallet from the header to get started.</p>
        ) : (
          <SimpleStorageSection /> // Show DApp interaction section if wallet is connected
        )}
      </main>
    </div>
  );
}
