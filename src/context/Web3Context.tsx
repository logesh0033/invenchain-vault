
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../types/inventory';
import { toast } from '@/components/ui/sonner';

// Initial state
const initialWeb3State: Web3State = {
  isConnected: false,
  account: null,
  chainId: null,
  provider: null,
  error: null,
};

interface Web3ContextProps {
  web3State: Web3State;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isWeb3Enabled: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>(initialWeb3State);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState<boolean>(false);

  // Effect to check if wallet is already connected
  useEffect(() => {
    checkIfWalletIsConnected();
    
    // Set up event listeners for account and chain changes
    const setupEventListeners = () => {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
      }
    };

    setupEventListeners();
    
    // Cleanup event listeners
    return () => {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
      toast({
        title: "Wallet disconnected",
        description: "You've disconnected your wallet.",
      });
    } else if (accounts[0] !== web3State.account) {
      // Account changed, update state
      updateAccount(accounts[0]);
      toast({
        title: "Account changed",
        description: `Connected to ${formatAddress(accounts[0])}`,
      });
    }
  };

  // Handle chain/network changes
  const handleChainChanged = (chainId: string) => {
    // Force refresh when chain changes
    window.location.reload();
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      // Check if window.ethereum is available
      const { ethereum } = window;
      if (!ethereum) {
        setWeb3State({
          ...initialWeb3State,
          error: "MetaMask is not installed. Please install it to use this app.",
        });
        return;
      }
      
      setIsWeb3Enabled(true);

      // Get provider
      const provider = new ethers.BrowserProvider(ethereum);
      
      // Check if we're already connected
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0].address;
        const network = await provider.getNetwork();
        
        setWeb3State({
          isConnected: true,
          account: account,
          chainId: Number(network.chainId),
          provider: provider,
          error: null,
        });

        // Store connected status in local storage
        localStorage.setItem('walletConnected', 'true');
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error);
      setWeb3State({
        ...initialWeb3State,
        error: "Failed to connect to wallet.",
      });
    }
  };

  // Update account in state
  const updateAccount = async (account: string) => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      
      setWeb3State({
        isConnected: true,
        account: account,
        chainId: Number(network.chainId),
        provider: provider,
        error: null,
      });
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          variant: "destructive",
          title: "Wallet not found",
          description: "MetaMask is not installed. Please install it to use this app.",
        });
        
        setWeb3State({
          ...web3State,
          error: "MetaMask is not installed. Please install it to use this app.",
        });
        return;
      }
      
      // Request account access
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);
      
      // Get the connected account
      const accounts = await provider.listAccounts();
      const account = accounts[0].address;
      
      // Get the network information
      const network = await provider.getNetwork();
      
      setWeb3State({
        isConnected: true,
        account: account,
        chainId: Number(network.chainId),
        provider: provider,
        error: null,
      });
      
      // Store connected status in local storage
      localStorage.setItem('walletConnected', 'true');
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${formatAddress(account)}`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect wallet.",
      });
      
      setWeb3State({
        ...web3State,
        error: "Failed to connect wallet.",
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3State(initialWeb3State);
    localStorage.removeItem('walletConnected');
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;
      
      // Convert chainId to hex
      const chainIdHex = `0x${chainId.toString(16)}`;
      
      try {
        // Try to switch to the network
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        
        toast({
          title: "Network changed",
          description: `Switched to ${getNetworkName(chainId)}`,
        });
      } catch (switchError: any) {
        // If the network isn't added to MetaMask, we need to add it
        if (switchError.code === 4902) {
          toast({
            variant: "destructive",
            title: "Network not available",
            description: "This network needs to be added to your wallet first.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Network switch failed",
            description: "Failed to switch network.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };
  
  // Helper function to get network name from chainId
  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli Testnet";
      case 11155111:
        return "Sepolia Testnet";
      default:
        return `Network ${chainId}`;
    }
  };

  return (
    <Web3Context.Provider value={{ 
      web3State, 
      connectWallet, 
      disconnectWallet, 
      isWeb3Enabled, 
      switchNetwork 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
