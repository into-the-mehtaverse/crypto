"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useAccount } from "wagmi";

const COUNTER_ABI = [
  { inputs: [], name: "number", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "increment", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "_number", type: "uint256" }], name: "setNumber", outputs: [], stateMutability: "nonpayable", type: "function" },
] as const;

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;

export default function Home() {
  const { isConnected } = useAccount();
  const { data: number, refetch } = useReadContract({
    address: CONTRACT_ADDRESS || undefined,
    abi: COUNTER_ABI,
    functionName: "number",
  });
  const { writeContract, isPending } = useWriteContract();

  const handleIncrement = () => {
    if (!CONTRACT_ADDRESS) return;
    writeContract(
      { address: CONTRACT_ADDRESS, abi: COUNTER_ABI, functionName: "increment" },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-white">Counter</h1>
          <ConnectButton />
        </div>

        {!isConnected && (
          <p className="text-zinc-400 text-center py-8">Connect your wallet to interact with the contract.</p>
        )}

        {isConnected && (
          <div className="space-y-6">
            <div className="rounded-lg bg-zinc-800/80 px-4 py-3">
              <p className="text-sm text-zinc-400">Current value</p>
              <p className="text-2xl font-mono text-white">{number !== undefined ? String(number) : "—"}</p>
            </div>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={!CONTRACT_ADDRESS || isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isPending ? "Incrementing…" : "Increment"}
            </button>
            {!CONTRACT_ADDRESS && (
              <p className="text-amber-500/90 text-sm">
                Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env and redeploy the contract to enable actions.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
