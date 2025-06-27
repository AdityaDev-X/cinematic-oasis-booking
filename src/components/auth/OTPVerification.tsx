
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

export const OTPVerification = ({ email, onBack, onVerified }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup'
    });

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Verified!",
        description: "Welcome to FlameStream Cinema",
      });
      onVerified();
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResending(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code Resent",
        description: "Check your email for a new verification code",
      });
    }
    setResending(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to<br />
          <span className="font-medium text-gray-900">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">Enter Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP 
                value={otp} 
                onChange={setOtp}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-red-600 hover:underline font-medium"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
          
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
