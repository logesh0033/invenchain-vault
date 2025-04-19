
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  sku: string;
  location: string;
  lastUpdated: string;
  supplier: string;
  blockchainId?: string;
  transactionHash?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'ADD' | 'REMOVE' | 'UPDATE' | 'TRANSFER';
  itemId: string;
  itemName: string;
  quantity: number;
  timestamp: string;
  user: string;
  transactionHash: string;
  blockNumber?: number;
  details?: string;
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: any; // ethers.js provider
  error: string | null;
}
