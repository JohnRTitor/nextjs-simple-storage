import { simpleStorageAbi, simpleStorageAddress } from "@/constants";
import { AddPersonParams, StoreGlobalFavoriteNumberParams } from "@/types/core";
import { toast } from "sonner";
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useState } from "react";
import { ContractFunctionArgs } from "viem";

export function useSimpleStorageFunction(functionName: string) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const execute = async (args: ContractFunctionArgs) => {
    console.log("Contract Function:", functionName, args);
    const txHash = await toast
      .promise(
        writeContractAsync({
          functionName,
          abi: simpleStorageAbi,
          address: simpleStorageAddress,
          args,
        }),
        {
          loading: "Waiting for wallet confirmation...",
          success: (data) => {
            setHash(data);
            return "Transaction sent!";
          },
          error: (err: BaseError) => {
            console.warn("Write Error:", err);
            return err.shortMessage || "Transaction failed.";
          },
        },
      )
      .unwrap();

    setHash(txHash);
    return { hash: txHash };
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
