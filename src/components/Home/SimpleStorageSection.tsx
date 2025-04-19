"use client";

import { useReadContract } from "wagmi";
import { simpleStorageAbi, simpleStorageAddress } from "@/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAddPerson, useStoreGlobalFavoriteNumber } from "@/hooks/core";
import type { PersonTuple } from "@/types/core";

function SimpleStorageSection() {
  const [newFavNumber, setNewFavNumber] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [nameNumber, setNameNumber] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>("");
  const [queryIndex, setQueryIndex] = useState<number>(0);

  const { data: storedFavoriteNumber, refetch: refetchFavoriteNumber } = useReadContract({
    address: simpleStorageAddress,
    abi: simpleStorageAbi,
    functionName: "retrieveGlobalFavoriteNumber",
  });

  const { data: nameToFavNumber } = useReadContract({
    address: simpleStorageAddress,
    abi: simpleStorageAbi,
    functionName: "nameToFavoriteNumber",
    args: [queryName],
  });

  const { data: personAtIndex } = useReadContract({
    address: simpleStorageAddress,
    abi: simpleStorageAbi,
    functionName: "personList",
    args: [BigInt(queryIndex)],
  }) as { data: PersonTuple | undefined };

  const {
    storeNumber,
    isPending: isStorePending,
    isConfirming: isStoreConfirming,
    isConfirmed: isStoreConfirmed,
  } = useStoreGlobalFavoriteNumber();
  const handleStoreNumber = async () => {
    await storeNumber({ favoriteNumber: newFavNumber });
  };

  const {
    addPerson,
    isPending: isAddPersonPending,
    isConfirming: isAddPersonConfirming,
    isConfirmed: isAddPersonConfirmed,
  } = useAddPerson();
  const handleAddPerson = async () => {
    await addPerson({ name, favoriteNumber: nameNumber });
  };

  useEffect(() => {
    if (isStoreConfirmed) {
      toast.success("Favorite number stored!");
      refetchFavoriteNumber();
    }
  }, [isStoreConfirmed, refetchFavoriteNumber]);

  useEffect(() => {
    if (isAddPersonConfirmed) {
      toast.success("Person added successfully!");
    }
  }, [isAddPersonConfirmed]);

  return (
    <div className="space-y-6 p-4 w-full max-w-5xl mx-auto">
      <h4 className="text-2xl font-bold text-center"> Interact with the contract below! </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Favorite Number */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 shadow rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-lg">Store Global Favorite Number</h3>
          <input
            type="number"
            placeholder="Enter new favorite number"
            value={newFavNumber}
            onChange={(e) => setNewFavNumber(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleStoreNumber}
            disabled={isStorePending || isStoreConfirming}
            className={`w-full p-2 rounded text-white ${
              isStorePending || isStoreConfirming
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isStorePending ? "Submitting..." : isStoreConfirming ? "Confirming..." : "Store It!"}
          </button>
          <p className="text-sm text-center">
            Current:{" "}
            <span className="font-semibold">
              {storedFavoriteNumber?.toString() || "Loading..."}
            </span>
          </p>
        </div>

        {/* Add Person */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 shadow rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-lg">Add a Person</h3>
          <input
            type="text"
            placeholder="Person's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Their favorite number"
            value={nameNumber}
            onChange={(e) => setNameNumber(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleAddPerson}
            disabled={isAddPersonPending || isAddPersonConfirming}
            className={`w-full p-2 rounded text-white ${
              isAddPersonPending || isAddPersonConfirming
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isAddPersonPending
              ? "Submitting..."
              : isAddPersonConfirming
                ? "Confirming..."
                : "Add Person"}
          </button>
        </div>

        {/* Query by Name */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 shadow rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-lg">Query by Name</h3>
          <input
            type="text"
            placeholder="Enter name to look up"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-center">
            Favorite Number for <span className="font-semibold">{queryName || "___"}</span>:{" "}
            <span className="font-semibold">{nameToFavNumber?.toString() ?? "—"}</span>
          </p>
        </div>

        {/* Query by Index */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 shadow rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-lg">Query by Index</h3>
          <input
            type="number"
            placeholder="Enter index to fetch"
            value={queryIndex}
            onChange={(e) => setQueryIndex(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-center">
            Person at index {queryIndex}:{" "}
            <span className="font-semibold">
              {personAtIndex ? `${personAtIndex[1]} (Fav #: ${personAtIndex[0]})` : "—"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimpleStorageSection;
