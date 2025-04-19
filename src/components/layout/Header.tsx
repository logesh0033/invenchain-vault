
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { WalletIcon, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { web3State, connectWallet, disconnectWallet, isWeb3Enabled } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Check if auto-connect is enabled
  useEffect(() => {
    const autoConnect = localStorage.getItem('autoConnect') === 'true';
    if (autoConnect && isWeb3Enabled && !web3State.isConnected) {
      handleConnectWallet();
    }
  }, [isWeb3Enabled]);
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Get network name
  const getNetworkName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';
    
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli Testnet";
      case 11155111:
        return "Sepolia Testnet";
      default:
        return `Chain ${chainId}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex-1">
          {/* This space intentionally left empty for layout balance */}
        </div>
        
        <div className="flex items-center space-x-4">
          {isWeb3Enabled ? (
            <>
              {!web3State.isConnected ? (
                <Button 
                  onClick={handleConnectWallet} 
                  variant="outline" 
                  className="flex items-center" 
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <WalletIcon className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <div className={cn(
                        "flex items-center px-2 py-1 text-xs font-medium rounded-full mr-2",
                        "bg-success bg-opacity-15 text-success"
                      )}>
                        <div className="w-2 h-2 mr-2 rounded-full bg-success"></div>
                        <span>{formatAddress(web3State.account || '')}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                    <DropdownMenuItem className="text-sm">
                      {getNetworkName(web3State.chainId)}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 px-3 py-1.5 rounded-md">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>Web3 provider not detected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
