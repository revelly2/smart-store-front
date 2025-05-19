
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesApi } from '@/services/api';
import { Sale } from '@/types/api';

// Mock data for demo - in real app this would come from API
const mockSalesData = {
  today: { count: 12, total: 2450.75 },
  week: { count: 87, total: 15680.25 },
  month: { count: 342, total: 67890.50 }
};

const mockRecentSales = [
  { id: 1, cashier_name: "John Doe", total: 245.50, created_at: "2025-05-19T10:12:45", items: [] },
  { id: 2, cashier_name: "Sarah Smith", total: 187.20, created_at: "2025-05-19T09:32:18", items: [] },
  { id: 3, cashier_name: "John Doe", total: 352.85, created_at: "2025-05-19T08:45:30", items: [] },
  { id: 4, cashier_name: "Mike Johnson", total: 125.75, created_at: "2025-05-18T16:22:10", items: [] }
];

const Dashboard = () => {
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(mockSalesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await salesApi.getAll();
        // if (response.success && response.data) {
        //   setRecentSales(response.data.slice(0, 5));
        // }
        
        // Using mock data for demo
        setRecentSales(mockRecentSales as Sale[]);
        setStats(mockSalesData);
      } catch (error) {
        console.error('Error fetching sales data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.today.total)}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.today.count} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.week.total)}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.week.count} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.month.total)}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.month.count} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{sale.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.cashier_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(sale.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
