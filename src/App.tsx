
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Sales from "@/pages/admin/Sales";
import CashierDashboard from "@/pages/cashier/Dashboard";
import Cart from "@/pages/cashier/Cart";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requiredRole="admin">
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="/admin/sales" element={
                <ProtectedRoute requiredRole="admin">
                  <Sales />
                </ProtectedRoute>
              } />
              
              {/* Cashier Routes */}
              <Route path="/cashier" element={
                <ProtectedRoute requiredRole="cashier">
                  <CashierDashboard />
                </ProtectedRoute>
              } />
              <Route path="/cashier/cart" element={
                <ProtectedRoute requiredRole="cashier">
                  <Cart />
                </ProtectedRoute>
              } />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
