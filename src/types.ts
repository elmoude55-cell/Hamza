export interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: string;
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previousHash: string;
}

export interface CoinConfig {
  name: string;
  symbol: string;
  consensus: "Proof of Work" | "Proof of Stake" | "Proof of Authority";
  totalSupply: number;
  blockReward: number;
  difficulty: number;
  description: string;
  iconSymbol: string;
  iconColor: string;
}

export interface MarketState {
  currentPrice: number;
  priceHistory: { time: string; price: number }[];
  marketCap: number;
  circulatingSupply: number;
  volume24h: number;
  ownerBalance: number;
  unconfirmedTransactions: Transaction[];
}

export interface NewsArticle {
  title: string;
  content: string;
  impact: string; // e.g. "إيجابي جداً", "إيجابي", "حيادي", "سلبي", "سلبي جداً"
  priceChangeForecast: string; // e.g., "+15%" or "-4%"
  isFallback?: boolean;
  isCached?: boolean;
}

export interface CoinAuditReport {
  tokenomicsRating: string;
  inflationReview: string;
  securityAudit: string;
  advisoryTips: string[];
  score: number;
  isFallback?: boolean;
  isCached?: boolean;
}
