
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-red-100 p-6 text-red-600 mb-6">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
      </p>
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
