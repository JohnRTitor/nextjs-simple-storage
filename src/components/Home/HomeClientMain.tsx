"use client";

import { useAccount, useSwitchChain } from "wagmi";
import SimpleStorageSection from "@/components/Home/SimpleStorageSection";
import CommonHeader from "@/components/Header";
import { toast } from "sonner";

export default function HomeClientMain() {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const sepoliaChainId = 11155111;
  const isOnSepolia = chain?.id === sepoliaChainId; // Sepolia chain ID

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
        ) : !isOnSepolia && switchChain ? (
          <>
            <h2 className="text-2xl font-semibold">Wrong Network</h2>
            <p className="text-gray-500">Please switch to the Sepolia test network.</p>
            {
              <button
                onClick={() =>
                  switchChain(
                    { chainId: sepoliaChainId },
                    {
                      onSuccess: () => {
                        console.log("Switched to Sepolia");
                        toast.success("Successfully switched to Sepolia Network");
                      },
                      onError: (error) => {
                        console.warn("Failed to switch to Sepolia", error);
                        toast.error("Failed to switch to Sepolia Network");
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
