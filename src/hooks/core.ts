import { simpleStorageAbi, simpleStorageAddress } from "@/constants";
import { AddPersonParams, StoreGlobalFavoriteNumberParams } from "@/types/core";
import { toast } from "sonner";
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useState } from "react";

export function useSimpleStorageFunction(functionName: string) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const execute = async (args: any[]) => {
    console.log("Contract Function:", functionName, args);
    try {
      toast("Notification", {
        description: "Please confirm the transaction in your wallet.",
      });

      const txHash = await writeContractAsync({
        functionName,
        abi: simpleStorageAbi,
        address: simpleStorageAddress,
        args,
      });

      setHash(txHash);
      return { hash: txHash };
    } catch (err) {
      const error = err as BaseError;
      toast.error("Error", {
        description: error.message,
      });
      console.error("Write Error:", error);
      return { error: error.message };
    }
  };

  return {
    execute,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

export function useStoreGlobalFavoriteNumber() {
  const { execute, isPending, isConfirming, isConfirmed, hash } = useSimpleStorageFunction(
    "storeGlobalFavoriteNumber",
  );

  const storeNumber = async ({ favoriteNumber }: StoreGlobalFavoriteNumberParams) => {
    return execute([BigInt(favoriteNumber)]);
  };

  return {
    storeNumber,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

export function useAddPerson() {
  const { execute, isPending, isConfirming, isConfirmed, hash } =
    useSimpleStorageFunction("addPerson");

  const addPerson = async ({ name, favoriteNumber }: AddPersonParams) => {
    return execute([name, BigInt(favoriteNumber)]);
  };

  return {
    addPerson,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}
