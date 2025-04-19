
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { web3State } = useWeb3();

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
            <CardTitle>Blockchain Settings</CardTitle>
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
                <Switch id="auto-connect" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for blockchain transactions
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Connected Network</h3>
              <div className="mt-2 p-3 rounded-md bg-secondary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {web3State.chainId === 1 && 'Ethereum Mainnet'}
                      {web3State.chainId === 5 && 'Goerli Testnet'}
                      {web3State.chainId === 11155111 && 'Sepolia Testnet'}
                      {!web3State.chainId && 'Not Connected'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {web3State.chainId ? `Chain ID: ${web3State.chainId}` : 'Connect wallet to view network'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled={!web3State.isConnected}>
                    Change Network
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
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
                <Switch id="dark-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sending anonymous usage data
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
