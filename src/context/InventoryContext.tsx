
import { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem, TransactionRecord } from '../types/inventory';
import { useWeb3 } from './Web3Context';
import { useToast } from '@/components/ui/use-toast';

// Mock data for initial development
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    category: 'Electronics',
    quantity: 15,
    price: 1299.99,
    sku: 'ELEC-LAP-001',
    location: 'Warehouse A',
    lastUpdated: new Date().toISOString(),
    supplier: 'TechSupplies Inc.',
    blockchainId: '0x1234567890123456789012345678901234567890',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '2',
    name: 'Office Chair',
    description: 'Ergonomic office chair with adjustable height',
    category: 'Furniture',
    quantity: 30,
    price: 159.99,
    sku: 'FURN-CHR-002',
    location: 'Warehouse B',
    lastUpdated: new Date().toISOString(),
    supplier: 'OfficeFurnish Ltd.',
    blockchainId: '0x2345678901234567890123456789012345678901',
    transactionHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a'
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    category: 'Electronics',
    quantity: 50,
    price: 89.99,
    sku: 'ELEC-AUD-003',
    location: 'Warehouse A',
    lastUpdated: new Date().toISOString(),
    supplier: 'AudioTech Co.',
    blockchainId: '0x3456789012345678901234567890123456789012',
    transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
  },
  {
    id: '4',
    name: 'LED Monitor',
    description: '27-inch 4K Ultra HD Monitor',
    category: 'Electronics',
    quantity: 20,
    price: 349.99,
    sku: 'ELEC-MON-004',
    location: 'Warehouse C',
    lastUpdated: new Date().toISOString(),
    supplier: 'DisplayTech Inc.',
    blockchainId: '0x4567890123456789012345678901234567890123',
    transactionHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc'
  }
];

const mockTransactionRecords: TransactionRecord[] = [
  {
    id: 'tx1',
    type: 'ADD',
    itemId: '1',
    itemName: 'Premium Laptop',
    quantity: 20,
    timestamp: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    user: '0xuser1',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 14356789,
    details: 'Initial inventory addition'
  },
  {
    id: 'tx2',
    type: 'REMOVE',
    itemId: '1',
    itemName: 'Premium Laptop',
    quantity: 5,
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    user: '0xuser1',
    transactionHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a',
    blockNumber: 14356901,
    details: 'Sent to customer order #10293'
  },
  {
    id: 'tx3',
    type: 'ADD',
    itemId: '2',
    itemName: 'Office Chair',
    quantity: 30,
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    user: '0xuser2',
    transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 14357012,
    details: 'Restocking from supplier'
  },
  {
    id: 'tx4',
    type: 'ADD',
    itemId: '3',
    itemName: 'Wireless Headphones',
    quantity: 50,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: '0xuser1',
    transactionHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    blockNumber: 14357256,
    details: 'New inventory arrival'
  },
  {
    id: 'tx5',
    type: 'ADD',
    itemId: '4',
    itemName: 'LED Monitor',
    quantity: 20,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: '0xuser2',
    transactionHash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    blockNumber: 14357890,
    details: 'Initial stock'
  }
];

interface InventoryContextProps {
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'blockchainId' | 'transactionHash'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeInventoryItem: (id: string) => Promise<void>;
  getInventoryItem: (id: string) => InventoryItem | undefined;
  getTransactionsByItemId: (itemId: string) => TransactionRecord[];
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(mockTransactionRecords);
  const { web3State } = useWeb3();
  const { toast } = useToast();

  // Add a new inventory item
  const addInventoryItem = async (
    item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'blockchainId' | 'transactionHash'>
  ) => {
    try {
      // In a real app, we would call the smart contract here
      // For now, we'll just simulate the blockchain transaction
      
      const newId = (inventory.length + 1).toString();
      const timestamp = new Date().toISOString();
      
      // Simulate blockchain transaction
      const mockBlockchainId = `0x${Math.floor(Math.random() * 1000000000000).toString(16).padStart(40, '0')}`;
      const mockTransactionHash = `0x${Math.floor(Math.random() * 1000000000000).toString(16).padStart(64, '0')}`;
      
      const newItem: InventoryItem = {
        ...item,
        id: newId,
        lastUpdated: timestamp,
        blockchainId: mockBlockchainId,
        transactionHash: mockTransactionHash
      };
      
      setInventory(current => [...current, newItem]);
      
      // Create transaction record
      const transactionRecord: TransactionRecord = {
        id: `tx${transactions.length + 1}`,
        type: 'ADD',
        itemId: newId,
        itemName: item.name,
        quantity: item.quantity,
        timestamp: timestamp,
        user: web3State.account || '0xUnknownUser',
        transactionHash: mockTransactionHash,
        blockNumber: 14358000 + Math.floor(Math.random() * 1000),
        details: 'Added new inventory item'
      };
      
      setTransactions(current => [...current, transactionRecord]);
      
      toast({
        title: "Success",
        description: `Added ${item.quantity} ${item.name} to inventory`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };

  // Update an existing inventory item
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      // In a real app, we would call the smart contract here
      
      const timestamp = new Date().toISOString();
      const mockTransactionHash = `0x${Math.floor(Math.random() * 1000000000000).toString(16).padStart(64, '0')}`;
      
      setInventory(current => 
        current.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...updates,
              lastUpdated: timestamp,
              transactionHash: mockTransactionHash
            };
          }
          return item;
        })
      );
      
      // Find the item to get the name
      const item = inventory.find(item => item.id === id);
      
      if (item) {
        // Create transaction record
        const transactionRecord: TransactionRecord = {
          id: `tx${transactions.length + 1}`,
          type: 'UPDATE',
          itemId: id,
          itemName: item.name,
          quantity: 'quantity' in updates ? updates.quantity || 0 : item.quantity,
          timestamp: timestamp,
          user: web3State.account || '0xUnknownUser',
          transactionHash: mockTransactionHash,
          blockNumber: 14358000 + Math.floor(Math.random() * 1000),
          details: `Updated inventory item details`
        };
        
        setTransactions(current => [...current, transactionRecord]);
      }
      
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
    }
  };

  // Remove an inventory item
  const removeInventoryItem = async (id: string) => {
    try {
      // In a real app, we would call the smart contract here
      
      // Find the item before removing it
      const item = inventory.find(item => item.id === id);
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      const timestamp = new Date().toISOString();
      const mockTransactionHash = `0x${Math.floor(Math.random() * 1000000000000).toString(16).padStart(64, '0')}`;
      
      setInventory(current => current.filter(item => item.id !== id));
      
      // Create transaction record
      const transactionRecord: TransactionRecord = {
        id: `tx${transactions.length + 1}`,
        type: 'REMOVE',
        itemId: id,
        itemName: item.name,
        quantity: item.quantity,
        timestamp: timestamp,
        user: web3State.account || '0xUnknownUser',
        transactionHash: mockTransactionHash,
        blockNumber: 14358000 + Math.floor(Math.random() * 1000),
        details: 'Removed item from inventory'
      };
      
      setTransactions(current => [...current, transactionRecord]);
      
      toast({
        title: "Success",
        description: `Removed ${item.name} from inventory`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to remove inventory item",
        variant: "destructive",
      });
    }
  };

  // Get an inventory item by ID
  const getInventoryItem = (id: string) => {
    return inventory.find(item => item.id === id);
  };

  // Get all transactions for a specific item
  const getTransactionsByItemId = (itemId: string) => {
    return transactions.filter(transaction => transaction.itemId === itemId);
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      transactions,
      addInventoryItem,
      updateInventoryItem,
      removeInventoryItem,
      getInventoryItem,
      getTransactionsByItemId
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
