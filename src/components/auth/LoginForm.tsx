
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting to sign in with:', { email });
    const { error } = await signIn(email, password);

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/80 border-red-900">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
        <CardDescription className="text-gray-300">Sign in to your FlameStream account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-red-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-red-700 text-white"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-red-400 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
