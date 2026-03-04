"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isWalletConnectError =
    error?.message?.includes("Connection interrupted") ||
    error?.message?.includes("subscribe");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-900 text-white">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-xl font-semibold text-zinc-100">
          {isWalletConnectError ? "WalletConnect unavailable" : "Something went wrong"}
        </h1>
        <p className="text-zinc-400 text-sm">
          {isWalletConnectError
            ? "WalletConnect could not connect (e.g. invalid or missing project ID). Use MetaMask or another browser wallet instead."
            : error?.message ?? "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
        >
          Try again
        </button>
        <p className="text-zinc-500 text-xs">
          Or refresh the page and choose <strong>MetaMask</strong> to connect.
        </p>
      </div>
    </div>
  );
}
