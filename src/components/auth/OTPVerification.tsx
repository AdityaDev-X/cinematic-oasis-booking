
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Smartphone } from 'lucide-react';

interface OTPVerificationProps {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
}

export const OTPVerification = ({ phone, onBack, onVerified }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    
    // For now, we'll simulate OTP verification since Supabase doesn't have built-in SMS OTP
    // In production, you'd integrate with a service like Twilio
    if (otp === '123456') {
      toast({
        title: "Phone Verified!",
        description: "Welcome to FlameStream",
      });
      onVerified();
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check the 6-digit code sent to your phone",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResending(true);
    
    // Simulate sending SMS OTP
    // In production, integrate with Twilio or similar service
    setTimeout(() => {
      toast({
        title: "Code Sent",
        description: "A new 6-digit code has been sent to your phone",
      });
      setResending(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/80 border-red-900">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Verify Your Phone</CardTitle>
        <CardDescription className="text-gray-300">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium text-red-400">{phone}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-center block text-gray-300">Enter Verification Code</label>
            <div className="flex justify-center">
              <InputOTP 
                value={otp} 
                onChange={setOtp}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-red-500 text-white" />
                  <InputOTPSlot index={1} className="border-red-500 text-white" />
                  <InputOTPSlot index={2} className="border-red-500 text-white" />
                  <InputOTPSlot index={3} className="border-red-500 text-white" />
                  <InputOTPSlot index={4} className="border-red-500 text-white" />
                  <InputOTPSlot index={5} className="border-red-500 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-gray-400 text-center">For demo: use 123456</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Phone'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-gray-400">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-red-400 hover:underline font-medium"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
          
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
