
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInventory } from '@/context/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Truck, History, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { inventory, transactions } = useInventory();

  // Calculate summary data
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const recentTransactions = transactions.slice(0, 3);
  
  // Create category data for chart
  const categoryData: Record<string, number> = {};
  inventory.forEach(item => {
    if (categoryData[item.category]) {
      categoryData[item.category] += item.quantity;
    } else {
      categoryData[item.category] = item.quantity;
    }
  });
  
  const chartData = Object.keys(categoryData).map(category => ({
    name: category,
    quantity: categoryData[category]
  }));

  // Low stock items (less than 10)
  const lowStockItems = inventory.filter(item => item.quantity < 10);

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to InvenChain Vault - Your blockchain-secured inventory management system
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique items tracked</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
              <Truck className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalQuantity}</div>
              <p className="text-xs text-muted-foreground mt-1">Total units in inventory</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6" />
                <path d="M12 18V6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total inventory value</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{transactions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recorded on blockchain</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Distribution of items across categories</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items running low on inventory</CardDescription>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-600 font-bold">{item.quantity} left</p>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground">All items have sufficient stock</p>
                  </div>
                )}
                <div className="flex justify-center">
                  <Link to="/inventory">
                    <Button variant="outline" size="sm">View All Inventory</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>The latest blockchain-recorded inventory changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        tx.type === 'ADD' ? 'bg-success' : 
                        tx.type === 'REMOVE' ? 'bg-destructive' : 'bg-primary'
                      }`}></div>
                      <span className="font-medium">{tx.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-1">
                    <p>{tx.itemName} - Qty: {tx.quantity}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {tx.transactionHash.substring(0, 15)}...
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <Link to="/history">
                  <Button variant="outline" size="sm">View All Transactions</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
