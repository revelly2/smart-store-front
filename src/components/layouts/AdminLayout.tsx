
import React, { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  ShoppingCart, 
  Tag, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <BarChart className="h-5 w-5" /> },
    { path: '/admin/products', label: 'Products', icon: <Tag className="h-5 w-5" /> },
    { path: '/admin/sales', label: 'Sales History', icon: <ShoppingCart className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-light flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-0 lg:w-16",
          "fixed lg:relative inset-y-0 left-0 z-40 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="py-6 px-4 border-b border-gray-200">
            <h1 className={cn(
              "font-bold text-blue-dark transition-all",
              isSidebarOpen ? "text-xl" : "text-xs lg:text-xl lg:opacity-0"
            )}>
              Store Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-all",
                        location.pathname === item.path
                          ? "bg-blue text-white"
                          : "text-gray-dark hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      <span className={cn(
                        "ml-3 transition-opacity",
                        isSidebarOpen ? "opacity-100" : "opacity-0 hidden lg:inline"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info & logout */}
          <div className="mt-auto border-t border-gray-200 p-4">
            <div className={cn(
              "text-sm text-gray-600 mb-2",
              isSidebarOpen ? "block" : "hidden lg:block lg:opacity-0"
            )}>
              {user?.name}
            </div>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center text-gray-700 hover:text-red-500 transition-all w-full justify-start",
                !isSidebarOpen && "px-0 lg:justify-center"
              )}
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              <span className={cn(
                "ml-2",
                isSidebarOpen ? "inline" : "hidden lg:inline lg:opacity-0"
              )}>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "lg:ml-0" : "lg:ml-0"
      )}>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
