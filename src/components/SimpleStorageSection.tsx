"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { simpleStorageAbi, simpleStorageAddress } from "@/constants";
import { useState } from "react";

function SimpleStorageSection() {
  const [newFavNumber, setNewFavNumber] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [nameNumber, setNameNumber] = useState<number>(0);

  const { data: storedFavoriteNumber, refetch: refetchFavoriteNumber } = useReadContract({
    address: simpleStorageAddress,
    abi: simpleStorageAbi,
    functionName: "retrieve",
  });

  const { data: hash, writeContract: writeStore, isPending } = useWriteContract();
  // Transaction receipt hook
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { writeContract: writeAddPerson } = useWriteContract();

  const handleStoreNumber = () => {
    writeStore({
      address: simpleStorageAddress,
      abi: simpleStorageAbi,
      functionName: "store",
      args: [BigInt(newFavNumber)],
    });
  };

  if (isConfirmed) {
    refetchFavoriteNumber();
  }

  const handleAddPerson = async () => {
    await writeAddPerson({
      address: simpleStorageAddress,
      abi: simpleStorageAbi,
      functionName: "addPerson",
      args: [name, BigInt(nameNumber)],
    });
  };

  return (
    <div className="space-y-6 border p-4 rounded-md w-full max-w-lg">
      <h2 className="text-xl font-bold text-center">📦 SimpleStorage Contract</h2>

      <p className="text-center">
        Current Favorite Number:{" "}
        <span className="font-semibold">{storedFavoriteNumber?.toString() || "Loading..."}</span>
      </p>

      <div className="space-y-3">
        <input
          type="number"
          placeholder="Enter new favorite number"
          value={newFavNumber}
          onChange={(e) => setNewFavNumber(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleStoreNumber}
          disabled={isPending || isConfirming}
          className={`w-full p-2 rounded text-white ${
            isPending || isConfirming
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Store Favorite Number"}
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Person's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Their favorite number"
          value={nameNumber}
          onChange={(e) => setNameNumber(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddPerson}
          className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
        >
          Add Person
        </button>
      </div>
    </div>
  );
}

export default SimpleStorageSection;
