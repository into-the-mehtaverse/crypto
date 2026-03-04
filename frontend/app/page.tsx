"use client";

import { useReadContract, useWriteContract, useAccount, useConnect, useDisconnect } from "wagmi";

const COUNTER_ABI = [
  { inputs: [], name: "number", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "increment", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "_number", type: "uint256" }], name: "setNumber", outputs: [], stateMutability: "nonpayable", type: "function" },
] as const;

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;

function ConnectWallet() {
  const { connectors, connect, isPending, error, isError } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400 font-mono truncate max-w-[140px]" title={address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  const handleConnect = () => {
    if (!connector) return;
    connect(
      { connector },
      {
        onError: (err) => {
          console.error("Connect error:", err);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-end gap-1">
      {isError && error && (
        <span className="text-xs text-red-400 max-w-[200px] truncate" title={error.message}>
          {error.message}
        </span>
      )}
      {!connector ? (
        <p className="text-sm text-amber-500/90 max-w-[220px] text-right">
          MetaMask not detected. <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline">Install it</a>, refresh, then try again.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}

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
          <ConnectWallet />
        </div>

        {!isConnected && (
          <div className="space-y-4 py-6">
            <p className="text-zinc-400 text-center">Connect your wallet to interact with the contract.</p>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-400">
              <p className="font-medium text-zinc-300 mb-2">What should happen when you click Connect:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>A <strong>MetaMask popup</strong> opens (or a new tab) asking you to connect this site to your wallet.</li>
                <li>You click &quot;Next&quot; then &quot;Connect&quot; in MetaMask.</li>
                <li>This page updates and shows your address and the Counter.</li>
              </ol>
              <p className="mt-3 text-amber-500/90">
                If nothing appears: check the browser address bar for a <strong>blocked popup</strong> icon and allow popups for this site, then try again.
              </p>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="space-y-6">
            <div className="rounded-lg bg-zinc-800/80 px-4 py-3">
              <p className="text-sm text-zinc-400">Current value</p>
              <p className="text-2xl font-mono text-white">{number !== undefined ? String(number) : "-"}</p>
            </div>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={!CONTRACT_ADDRESS || isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isPending ? "Incrementing..." : "Increment"}
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
