
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { EnhancedMovieList } from '@/components/movies/EnhancedMovieList';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { VideoPlayer } from '@/components/streaming/VideoPlayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const HomePage = () => {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovieId(movieId);
    // In a real app, you'd fetch the movie details here
    setSelectedMovie({ id: movieId, title: 'Selected Movie', video_url: '/sample-video.mp4' });
  };

  const handleSubscribeClick = () => {
    setShowPlans(true);
  };

  const handleBackToMovies = () => {
    setSelectedMovieId(null);
    setSelectedMovie(null);
    setShowPlans(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      <Header onSubscribeClick={handleSubscribeClick} />
      <main className="container mx-auto px-4 py-8">
        {showPlans ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToMovies}
                className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Movies
              </Button>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            </div>
            <SubscriptionPlans />
          </div>
        ) : selectedMovieId ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToMovies}
                className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Movies
              </Button>
              <h2 className="text-2xl font-bold text-white">Now Playing</h2>
            </div>
            <VideoPlayer movie={selectedMovie} />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">🔥 FlameStream</h2>
              <p className="text-red-200">Unlimited movies, TV shows and more</p>
            </div>
            <EnhancedMovieList onMovieSelect={handleMovieSelect} />
          </div>
        )}
      </main>
    </div>
  );
};
