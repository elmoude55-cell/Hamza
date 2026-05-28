import { Block, Transaction } from "./types";

// A simple and deterministic djb2-like or MurmurHash visual representation
// that produces a hex-like string resembling SHA-256 for educational blockchain transparency.
export function calculateHash(
  index: number,
  timestamp: string,
  transactions: Transaction[],
  nonce: number,
  previousHash: string
): string {
  const data = `${index}${timestamp}${JSON.stringify(transactions)}${nonce}${previousHash}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Convert 32-bit int to a 64-character aesthetic crypto hash
  const absHash = Math.abs(hash).toString(16).padStart(8, "0");
  const fill = "ac09df81b31278e90ff82937cd22910fae8a9bc6723efd671295b28a994efcbd";
  return (absHash + fill).slice(0, 64);
}

// Generate an exact hash validation check according to difficulty
// e.g., difficulty of 3 means the simulated hash should start with 3 zeros
export function isValidHash(hash: string, difficulty: number): boolean {
  const target = "0".repeat(difficulty);
  return hash.startsWith(target);
}

// Simulated mining step generator for visual feedback in React
export function getGenesisBlock(): Block {
  const tx: Transaction = {
    id: "tx-genesis",
    sender: "نظام الشبكة (Genesis)",
    recipient: "المطور",
    amount: 1000,
    timestamp: new Date("2026-01-01T00:00:00Z").toLocaleTimeString("ar-SA"),
  };
  
  const hash = calculateHash(0, "2026-01-01T00:00:00Z", [tx], 0, "0");
  return {
    index: 0,
    timestamp: "2026-01-01 10:00:00",
    transactions: [tx],
    nonce: 0,
    hash: hash,
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
  };
}
