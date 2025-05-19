
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page automatically
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-4xl font-bold mb-4 text-blue">Store Management System</h1>
        <p className="text-xl text-gray-600 mb-8">A complete solution for cashiers and administrators</p>
        <div className="flex justify-center space-x-4">
          <Button 
            className="bg-blue hover:bg-blue-dark"
            onClick={() => navigate('/login')}
          >
            Login Now
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default Index;
