"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { simpleStorageAbi, simpleStorageAddress } from "@/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FavoriteNumber = bigint;
type PersonName = string;

type PersonTuple = [FavoriteNumber, PersonName];

function SimpleStorageSection() {
  const [newFavNumber, setNewFavNumber] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [nameNumber, setNameNumber] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>("");
  const [queryIndex, setQueryIndex] = useState<number>(0);

  const { data: storedFavoriteNumber, refetch: refetchFavoriteNumber } = useReadContract({
    address: simpleStorageAddress,
    abi: simpleStorageAbi,
    functionName: "retrieve",
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
    functionName: "people",
    args: [BigInt(queryIndex)],
  }) as { data: PersonTuple | undefined };

  const { data: hash, writeContract: writeStore, isPending } = useWriteContract();

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

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Favorite number stored!");
      refetchFavoriteNumber();
    }
  }, [isConfirmed, refetchFavoriteNumber]);

  const handleAddPerson = async () => {
    await writeAddPerson({
      address: simpleStorageAddress,
      abi: simpleStorageAbi,
      functionName: "addPerson",
      args: [name, BigInt(nameNumber)],
    });
  };

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
            disabled={isPending || isConfirming}
            className={`w-full p-2 rounded text-white ${
              isPending || isConfirming
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Store It!"}
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
            className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
          >
            Add Person
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
