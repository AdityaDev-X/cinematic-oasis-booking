
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUp } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export const SignUpForm = ({ onToggleMode }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting to sign up with:', { email, fullName });
    const { error } = await signUp(email, password, fullName);

    if (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification.",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/80 border-red-900">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Join FlameStream</CardTitle>
        <CardDescription className="text-gray-300">Create your streaming account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-800 border-red-700 text-white"
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-red-400 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
