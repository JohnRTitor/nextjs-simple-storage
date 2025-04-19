"use client";

import { BaseError, useAccount, useSwitchChain } from "wagmi";
import SimpleStorageSection from "@/components/Home/SimpleStorageSection";
import CommonHeader from "@/components/Header";
import { toast } from "sonner";
import { sepolia } from "viem/chains";

export default function HomeClientMain() {
  const { isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const isOnSepolia = sepolia.id === chain?.id; // Sepolia chain ID

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CommonHeader />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!isConnected ? (
          <>
            <h2 className="text-2xl font-semibold">Welcome to the SimpleStorage DApp</h2>
            <p className="text-gray-500">
              Connect your wallet on the Sepolia testnet from the header to get started.
            </p>
          </>
        ) : !isOnSepolia ? (
          <>
            <h2 className="text-2xl font-semibold">Wrong Network</h2>
            <p className="text-gray-500">Please switch to the Sepolia test network.</p>
            {
              <button
                onClick={() =>
                  toast.promise(
                    switchChainAsync({
                      chainId: sepolia.id,
                    }),
                    {
                      loading: "Waiting for wallet confirmation...",
                      success: () => {
                        console.log("Switched to Sepolia");
                        return "Successfully switched to Sepolia Network";
                      },
                      error: (err: BaseError) => {
                        console.warn("Failed to switch to Sepolia", err);
                        return err.shortMessage || "Failed to switch to Sepolia Network";
                      },
                    },
                  )
                }
                className="px-4 py-2 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Switch to Sepolia
              </button>
            }
          </>
        ) : (
          <SimpleStorageSection />
        )}
      </main>
    </div>
  );
}
