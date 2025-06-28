
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase-auth';
import { Crown, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onSubscribeClick?: () => void;
}

export const Header = ({ onSubscribeClick }: HeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    }
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-red-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🔥</div>
          <h1 className="text-2xl font-bold text-white">FlameStream</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onSubscribeClick}
              className="flex items-center space-x-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Crown className="h-4 w-4" />
              <span>Plans</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-5 w-5" />
              <span className="text-sm">
                {user.displayName || user.email}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
