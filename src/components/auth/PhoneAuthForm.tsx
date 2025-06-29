
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { sendPhoneOTP, verifyPhoneOTP } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Phone, ArrowLeft } from 'lucide-react';

interface PhoneAuthFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const PhoneAuthForm = ({ onBack, onSuccess }: PhoneAuthFormProps) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    console.log('Sending OTP to phone:', phone);

    const { error } = await sendPhoneOTP(phone);

    if (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      setStep('otp');
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    console.log('Verifying OTP:', { phone, otp });

    const { error } = await verifyPhoneOTP(phone, otp);

    if (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Phone Verified!",
        description: "Successfully signed in with phone number",
      });
      onSuccess();
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const { error } = await sendPhoneOTP(phone);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/80 border-red-900">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {step === 'phone' ? 'Phone Sign In' : 'Verify Phone'}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {step === 'phone' 
            ? 'Enter your phone number to receive a verification code'
            : `Enter the 6-digit code sent to ${phone}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="bg-gray-800 border-red-700 text-white"
                required
              />
              <p className="text-xs text-gray-400">Include country code (e.g., +1 for US)</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading || !phone}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block text-gray-300">
                Enter Verification Code
              </Label>
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify Phone'}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-red-400 hover:underline font-medium"
                >
                  {loading ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
