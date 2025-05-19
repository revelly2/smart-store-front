
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Mock login for demo - in real app, this would call the Flask API
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be replaced with an API call
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: username === 'admin' ? 1 : 2,
            username,
            name: username === 'admin' ? 'Administrator' : 'Cashier User',
            role: username === 'admin' ? 'admin' : 'cashier'
          } as User,
          token: 'mock-jwt-token'
        }
      };
      
      if (mockResponse.success) {
        const { user, token } = mockResponse.data;
        
        // Save to state
        setUser(user);
        setToken(token);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/cashier');
        }
        
        toast({
          title: "Login successful",
          description: `Welcome, ${user.name}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
      }
    } catch (error) {
      console.error('Login failed', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirect to login
    navigate('/login');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
