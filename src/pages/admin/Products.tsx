
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { productApi } from '@/services/api';
import { Product } from '@/types/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });

  const { toast } = useToast();

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

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        image_url: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        image_url: formData.image_url || undefined
      };
      
      if (editingProduct) {
        // In a real app, this would be an API call
        // const response = await productApi.update(editingProduct.id, productData);
        // if (response.success) {
        //   setProducts(products.map(p => p.id === editingProduct.id ? response.data! : p));
        // }
        
        // For demo, update state directly
        setProducts(products.map(p => p.id === editingProduct.id 
          ? { ...p, ...productData, updated_at: new Date().toISOString() } 
          : p
        ));
        
        toast({
          title: "Product updated",
          description: `${productData.name} has been updated successfully`,
        });
      } else {
        // In a real app, this would be an API call
        // const response = await productApi.create(productData);
        // if (response.success && response.data) {
        //   setProducts([...products, response.data]);
        // }
        
        // For demo, update state directly
        const newProduct = {
          ...productData,
          id: Math.max(...products.map(p => p.id)) + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Product;
        
        setProducts([...products, newProduct]);
        
        toast({
          title: "Product created",
          description: `${productData.name} has been added successfully`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product`,
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      // In a real app, this would be an API call
      // const response = await productApi.delete(deletingProduct.id);
      // if (response.success) {
      //   setProducts(products.filter(p => p.id !== deletingProduct.id));
      // }
      
      // For demo, update state directly
      setProducts(products.filter(p => p.id !== deletingProduct.id));
      
      toast({
        title: "Product deleted",
        description: `${deletingProduct.name} has been removed`,
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-green hover:bg-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleOpenDeleteDialog(product)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the product details below.' 
                : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue hover:bg-blue-dark">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingProduct?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;
