
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { WalletIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { web3State, connectWallet, disconnectWallet, isWeb3Enabled } = useWeb3();
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
                <Button onClick={connectWallet} variant="outline" className="flex items-center">
                  <WalletIcon className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "flex items-center px-3 py-1.5 text-xs font-medium rounded-full",
                    "bg-success bg-opacity-15 text-success border border-success border-opacity-20"
                  )}>
                    <div className="w-2 h-2 mr-2 rounded-full bg-success"></div>
                    <span>{formatAddress(web3State.account || '')}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={disconnectWallet} 
                    className="text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md">
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
