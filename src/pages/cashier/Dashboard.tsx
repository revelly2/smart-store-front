
import React, { useState, useEffect } from 'react';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/api';
import { productApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Search, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo - in a real app this would come from API
const mockProducts = [
  { id: 1, name: "Laptop", price: 1299.99, stock: 15, category: "Electronics", created_at: "2025-05-10T10:00:00", updated_at: "2025-05-10T10:00:00" },
  { id: 2, name: "Smartphone", price: 899.99, stock: 25, category: "Electronics", created_at: "2025-05-11T10:00:00", updated_at: "2025-05-11T10:00:00" },
  { id: 3, name: "Coffee Maker", price: 99.99, stock: 10, category: "Home Appliances", created_at: "2025-05-12T10:00:00", updated_at: "2025-05-12T10:00:00" },
  { id: 4, name: "Office Chair", price: 199.99, stock: 8, category: "Furniture", created_at: "2025-05-13T10:00:00", updated_at: "2025-05-13T10:00:00" },
  { id: 5, name: "Headphones", price: 159.99, stock: 20, category: "Electronics", created_at: "2025-05-14T10:00:00", updated_at: "2025-05-14T10:00:00" },
  { id: 6, name: "Desk Lamp", price: 49.99, stock: 12, category: "Furniture", created_at: "2025-05-15T10:00:00", updated_at: "2025-05-15T10:00:00" }
];

const CashierDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Get unique categories from products
  const categories = products.length > 0 
    ? ['All', ...Array.from(new Set(products.map(p => p.category)))]
    : ['All'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await productApi.getAll();
        // if (response.success && response.data) {
        //   setProducts(response.data);
        // }
        
        // Using mock data for demo
        setProducts(mockProducts as Product[]);
      } catch (error) {
        console.error('Error fetching products', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch products",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || 
                            product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <CashierLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
            >
              <option value="">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Products grid */}
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found matching your search
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-w-3 aspect-h-2 bg-gray-100 flex items-center justify-center p-4">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="object-contain h-32"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center h-32">
                      <ShoppingCart size={32} />
                      <span className="mt-2 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <span className="text-sm bg-blue-light text-blue-dark px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        Stock: {product.stock}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-blue hover:bg-blue-dark"
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CashierLayout>
  );
};

export default CashierDashboard;
