
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CashierLayoutProps {
  children: ReactNode;
}

const CashierLayout: React.FC<CashierLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-light flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-dark">POS System</h1>
            <span className="text-sm text-gray-600">Cashier: {user?.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="relative"
              onClick={() => navigate('/cashier/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="ml-2">Cart</span>
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-red-500"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CashierLayout;
