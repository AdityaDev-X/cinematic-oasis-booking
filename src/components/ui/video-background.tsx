
import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  className?: string;
  overlay?: boolean;
}

export const VideoBackground = ({ src, className = '', overlay = true }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
    </div>
  );
};
