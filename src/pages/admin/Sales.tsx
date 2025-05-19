
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sale, SaleItem } from '@/types/api';
import { salesApi, generateReceipt } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo - in a real app this would come from API
const mockSales = [
  { 
    id: 1, 
    cashier_id: 2, 
    cashier_name: "John Doe", 
    total: 245.50, 
    payment_method: "cash",
    created_at: "2025-05-19T10:12:45", 
    items: [
      { product_id: 1, product_name: "Laptop", quantity: 1, price: 1299.99, subtotal: 1299.99 }
    ]
  },
  { 
    id: 2, 
    cashier_id: 3, 
    cashier_name: "Sarah Smith", 
    total: 187.20, 
    payment_method: "card",
    created_at: "2025-05-19T09:32:18", 
    items: [
      { product_id: 2, product_name: "Smartphone", quantity: 1, price: 899.99, subtotal: 899.99 },
      { product_id: 5, product_name: "Headphones", quantity: 1, price: 159.99, subtotal: 159.99 }
    ]
  },
  { 
    id: 3, 
    cashier_id: 2, 
    cashier_name: "John Doe", 
    total: 352.85, 
    payment_method: "cash",
    created_at: "2025-05-19T08:45:30", 
    items: [
      { product_id: 6, product_name: "Desk Lamp", quantity: 1, price: 49.99, subtotal: 49.99 },
      { product_id: 4, product_name: "Office Chair", quantity: 1, price: 199.99, subtotal: 199.99 },
      { product_id: 3, product_name: "Coffee Maker", quantity: 1, price: 99.99, subtotal: 99.99 }
    ]
  },
  { 
    id: 4, 
    cashier_id: 4, 
    cashier_name: "Mike Johnson", 
    total: 125.75, 
    payment_method: "card",
    created_at: "2025-05-18T16:22:10", 
    items: [
      { product_id: 3, product_name: "Coffee Maker", quantity: 1, price: 99.99, subtotal: 99.99 },
      { product_id: 6, product_name: "Desk Lamp", quantity: 1, price: 49.99, subtotal: 49.99 }
    ]
  }
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await salesApi.getAll();
        // if (response.success && response.data) {
        //   setSales(response.data);
        // }
        
        // Using mock data for demo
        setSales(mockSales as Sale[]);
      } catch (error) {
        console.error('Error fetching sales data', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch sales data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, [toast]);

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDialogOpen(true);
  };

  const downloadReceipt = async (saleId: number) => {
    try {
      // In a real app, this would be an API call
      // const pdfBlob = await generateReceipt(saleId);
      // if (pdfBlob) {
      //   const url = URL.createObjectURL(pdfBlob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = `receipt-${saleId}.pdf`;
      //   document.body.appendChild(a);
      //   a.click();
      //   document.body.removeChild(a);
      // }
      
      // For demo, show toast
      toast({
        title: "Receipt Generated",
        description: `Receipt #${saleId} would be downloaded in production`,
      });
    } catch (error) {
      console.error('Error generating receipt', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate receipt",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSales = sales.filter(sale => 
    sale.cashier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toString().includes(searchTerm) ||
    formatDate(sale.created_at).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Sales History</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by ID, cashier, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No sales found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{sale.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.cashier_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(sale.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{sale.payment_method}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => viewSaleDetails(sale)}>
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center"
                              onClick={() => downloadReceipt(sale.id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sale Details #{selectedSale?.id}</DialogTitle>
            <DialogDescription>
              {selectedSale && (
                <div className="text-sm text-gray-500">
                  <p>Cashier: {selectedSale.cashier_name}</p>
                  <p>Date: {formatDate(selectedSale.created_at)}</p>
                  <p>Payment Method: {selectedSale.payment_method}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedSale.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-bold">Total:</td>
                      <td className="px-4 py-2 text-right font-bold">{formatCurrency(selectedSale.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => downloadReceipt(selectedSale.id)}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Sales;
