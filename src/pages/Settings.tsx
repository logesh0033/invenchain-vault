
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { AlertCircle, Check, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { web3State, switchNetwork } = useWeb3();
  const [autoConnect, setAutoConnect] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(true);
  const [isChangingNetwork, setIsChangingNetwork] = useState<boolean>(false);
  
  // Load user preferences from localStorage on mount
  useEffect(() => {
    // Check auto-connect preference
    const savedAutoConnect = localStorage.getItem('autoConnect');
    if (savedAutoConnect) {
      setAutoConnect(savedAutoConnect === 'true');
    }
    
    // Check dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
      
      // Apply dark mode if enabled
      if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Check notifications preference
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(savedNotifications === 'true');
    }
    
    // Check analytics preference
    const savedAnalytics = localStorage.getItem('analytics');
    if (savedAnalytics) {
      setAnalytics(savedAnalytics === 'true');
    }
  }, []);
  
  // Handle network change
  const handleNetworkChange = async (chainId: string) => {
    setIsChangingNetwork(true);
    try {
      await switchNetwork(Number(chainId));
    } finally {
      setIsChangingNetwork(false);
    }
  };
  
  // Toggle auto-connect
  const toggleAutoConnect = (checked: boolean) => {
    setAutoConnect(checked);
    localStorage.setItem('autoConnect', String(checked));
    toast({
      title: "Setting saved",
      description: `Auto-connect ${checked ? 'enabled' : 'disabled'}`,
    });
  };
  
  // Toggle dark mode
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', String(checked));
    
    // Apply dark mode change
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: "Setting saved",
      description: `Dark mode ${checked ? 'enabled' : 'disabled'}`,
    });
  };
  
  // Toggle notifications
  const toggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications', String(checked));
    toast({
      title: "Setting saved",
      description: `Notifications ${checked ? 'enabled' : 'disabled'}`,
    });
  };
  
  // Toggle analytics
  const toggleAnalytics = (checked: boolean) => {
    setAnalytics(checked);
    localStorage.setItem('analytics', String(checked));
    toast({
      title: "Setting saved",
      description: `Analytics ${checked ? 'enabled' : 'disabled'}`,
    });
  };
  
  // Save all settings
  const saveSettings = () => {
    // All settings are already saved individually when toggled
    toast({
      title: "Settings saved",
      description: "All your preferences have been saved",
      icon: <Check className="h-4 w-4" />,
    });
  };
  
  // Helper function to get network name from chainId
  const getNetworkName = (chainId: number | null): string => {
    if (!chainId) return 'Not Connected';
    
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
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your InvenChain Vault preferences
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Blockchain Settings
            </CardTitle>
            <CardDescription>Configure your blockchain connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-connect">Auto Connect Wallet</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically connect to your wallet when the app loads
                  </p>
                </div>
                <Switch 
                  id="auto-connect" 
                  checked={autoConnect} 
                  onCheckedChange={toggleAutoConnect} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for blockchain transactions
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={toggleNotifications} 
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Connected Network</h3>
              <div className="p-3 rounded-md bg-secondary">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center">
                        {getNetworkName(web3State.chainId)}
                        {web3State.isConnected && (
                          <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {web3State.chainId ? `Chain ID: ${web3State.chainId}` : 'Connect wallet to view network'}
                      </p>
                    </div>
                  </div>
                  
                  {web3State.isConnected && (
                    <div className="w-full">
                      <Label htmlFor="network-select" className="mb-1 block">Change Network</Label>
                      <div className="flex items-center space-x-2">
                        <Select 
                          disabled={isChangingNetwork} 
                          onValueChange={handleNetworkChange} 
                          value={web3State.chainId?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Networks</SelectLabel>
                              <SelectItem value="1">Ethereum Mainnet</SelectItem>
                              <SelectItem value="5">Goerli Testnet</SelectItem>
                              <SelectItem value="11155111">Sepolia Testnet</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        
                        {isChangingNetwork && (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!web3State.isConnected && (
                    <div className="flex items-center text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 p-2 rounded-md">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Connect your wallet to change networks</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Application Settings
            </CardTitle>
            <CardDescription>Configure your application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode on or off
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sending anonymous usage data
                  </p>
                </div>
                <Switch 
                  id="analytics" 
                  checked={analytics} 
                  onCheckedChange={toggleAnalytics}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
