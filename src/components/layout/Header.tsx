
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Settings, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSubscribeClick: () => void;
  onSettingsClick?: () => void;
}

export const Header = ({ onSubscribeClick, onSettingsClick }: HeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    }
    setLoading(false);
  };

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-red-900/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">🔥 FlameStream</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onSubscribeClick}
            className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Plans
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white">
                <User className="h-4 w-4 mr-2" />
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-red-900 text-white">
              <DropdownMenuItem 
                onClick={onSettingsClick}
                className="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-red-900" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                disabled={loading}
                className="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
