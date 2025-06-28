
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  video_url: string;
  description?: string;
  duration?: number;
}

interface VideoPlayerProps {
  movie: Movie;
}

export const VideoPlayer = ({ movie }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-black border-red-900 overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              poster="/placeholder.svg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={movie.video_url || '/sample-video.mp4'} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={restart}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="p-6 bg-gray-900">
            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
            {movie.description && (
              <p className="text-gray-300 mb-4">{movie.description}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {movie.duration && (
                <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
              )}
              <span>HD Quality</span>
              <span>🔥 FlameStream Original</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
