
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { EnhancedSignUpForm } from './EnhancedSignUpForm';
import { OTPVerification } from './OTPVerification';

type AuthStep = 'login' | 'signup' | 'otp';

export const EnhancedAuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [otpEmail, setOtpEmail] = useState('');

  const toggleMode = () => {
    setCurrentStep(currentStep === 'login' ? 'signup' : 'login');
  };

  const handleOTPRequired = (email: string) => {
    setOtpEmail(email);
    setCurrentStep('otp');
  };

  const handleBackFromOTP = () => {
    setCurrentStep('signup');
  };

  const handleVerified = () => {
    setCurrentStep('login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-red-600/10 to-orange-400/10"></div>
        </div>
        
        {/* Animated Flames */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
          <div className="animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-2 bg-gradient-to-t from-red-600 to-orange-400 rounded-full animate-bounce"
                style={{
                  left: `${i * 5}%`,
                  height: `${Math.random() * 60 + 20}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🔥 FlameStream
            </h1>
            <p className="text-red-200">Premium Cinema Experience</p>
          </div>

          {/* Auth Forms */}
          {currentStep === 'login' && (
            <LoginForm onToggleMode={toggleMode} />
          )}
          {currentStep === 'signup' && (
            <EnhancedSignUpForm 
              onToggleMode={toggleMode} 
              onOTPRequired={handleOTPRequired}
            />
          )}
          {currentStep === 'otp' && (
            <OTPVerification 
              email={otpEmail}
              onBack={handleBackFromOTP}
              onVerified={handleVerified}
            />
          )}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 animate-float">
        <div className="w-16 h-16 bg-red-500 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="absolute top-1/3 left-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-orange-500 rounded-full opacity-20 blur-lg"></div>
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-20 bg-yellow-500 rounded-full opacity-10 blur-2xl"></div>
      </div>
    </div>
  );
};
