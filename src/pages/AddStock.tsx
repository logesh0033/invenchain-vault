
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/context/InventoryContext';
import { useWeb3 } from '@/context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Shield, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  location: z.string().min(1, 'Location is required'),
  supplier: z.string().min(1, 'Supplier is required'),
});

type FormValues = z.infer<typeof formSchema>;

const AddStock = () => {
  const { addInventoryItem } = useInventory();
  const { web3State } = useWeb3();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      quantity: 1,
      price: 0,
      sku: '',
      location: '',
      supplier: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!web3State.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add inventory items",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the inventory item - ensure all required fields are present
      await addInventoryItem({
        name: data.name,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        price: data.price,
        sku: data.sku,
        location: data.location,
        supplier: data.supplier
      });
      
      toast({
        title: "Stock Added",
        description: `${data.quantity} ${data.name} has been added to inventory`,
      });
      
      // Navigate back to inventory page
      navigate('/inventory');
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };
  
  // Sample categories
  const categories = [
    "Electronics", 
    "Furniture", 
    "Office Supplies", 
    "Peripherals",
    "Hardware", 
    "Software", 
    "Networking", 
    "Storage"
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Stock</h1>
          <p className="text-muted-foreground mt-1">
            Add new items to your blockchain-secured inventory
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New Inventory Item</CardTitle>
                <CardDescription>Enter details for the new inventory item</CardDescription>
              </div>
              <div className="flex items-center text-sm text-primary">
                <Shield className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Blockchain Secured</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!web3State.isConnected && (
              <div className="flex items-center p-4 mb-6 border rounded-md bg-amber-50 border-amber-200">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Wallet Not Connected</p>
                  <p className="text-sm text-amber-700">
                    Please connect your wallet to record inventory changes on the blockchain.
                  </p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter stock keeping unit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter item description" 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                            <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                            <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                            <SelectItem value="Main Office">Main Office</SelectItem>
                            <SelectItem value="Store Room">Store Room</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter supplier name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/inventory')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add to Inventory
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AddStock;
