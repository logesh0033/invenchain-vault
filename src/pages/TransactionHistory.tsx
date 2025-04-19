
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useInventory } from '@/context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from 'lucide-react';

const TransactionHistory = () => {
  const { transactions } = useInventory();

  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Generate a blockchain explorer URL for the transaction
  // This is a mock function - in real app would use appropriate blockchain explorer
  const getExplorerUrl = (txHash: string) => {
    // Mock explorer URL - would be replaced with actual explorer URL based on network
    return `https://etherscan.io/tx/${txHash}`;
  };

  // Get transaction type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADD':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REMOVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TRANSFER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground mt-1">
            View all blockchain-recorded inventory transactions
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">User</TableHead>
                    <TableHead className="hidden sm:table-cell">Date & Time</TableHead>
                    <TableHead className="hidden lg:table-cell">Block #</TableHead>
                    <TableHead className="hidden md:table-cell">Transaction Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs border ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{tx.itemName}</TableCell>
                      <TableCell className="text-right">{tx.quantity}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {tx.user}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {tx.blockNumber}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span className="font-mono text-xs truncate max-w-[140px]">
                            {tx.transactionHash.slice(0, 10)}...{tx.transactionHash.slice(-8)}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a 
                                  href={getExplorerUrl(tx.transactionHash)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="ml-2 text-primary hover:text-primary/80"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View on Blockchain Explorer</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TransactionHistory;
