
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { EnhancedMovieList } from '@/components/movies/EnhancedMovieList';
import { TheaterSelection } from '@/components/booking/TheaterSelection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const HomePage = () => {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovieId(movieId);
    setSelectedShowId(null);
  };

  const handleTheaterSelect = (theaterId: string, showId: string) => {
    setSelectedShowId(showId);
    console.log('Selected show:', showId, 'at theater:', theaterId);
  };

  const handleBackToMovies = () => {
    setSelectedMovieId(null);
    setSelectedShowId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!selectedMovieId ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">🔥 Now Streaming</h2>
              <p className="text-red-200">Experience cinema like never before</p>
            </div>
            <EnhancedMovieList onMovieSelect={handleMovieSelect} />
          </div>
        ) : (
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
              <h2 className="text-2xl font-bold text-white">Select Theater & Show Time</h2>
            </div>
            <TheaterSelection 
              movieId={selectedMovieId} 
              onTheaterSelect={handleTheaterSelect}
            />
          </div>
        )}
      </main>
    </div>
  );
};
