
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../types/inventory';

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
}

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>(initialWeb3State);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState<boolean>(false);

  // Effect to check if wallet is already connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Function to check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      // Check if window.ethereum is available
      const { ethereum } = window as any;
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
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error);
      setWeb3State({
        ...initialWeb3State,
        error: "Failed to connect to wallet.",
      });
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
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
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setWeb3State({
        ...web3State,
        error: "Failed to connect wallet.",
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3State(initialWeb3State);
  };

  return (
    <Web3Context.Provider value={{ web3State, connectWallet, disconnectWallet, isWeb3Enabled }}>
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
