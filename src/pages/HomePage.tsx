
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MovieList } from '@/components/movies/MovieList';
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
    // Here you would typically navigate to seat selection
    console.log('Selected show:', showId, 'at theater:', theaterId);
  };

  const handleBackToMovies = () => {
    setSelectedMovieId(null);
    setSelectedShowId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!selectedMovieId ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Now Showing</h2>
              <p className="text-gray-600">Choose from the latest movies</p>
            </div>
            <MovieList onMovieSelect={handleMovieSelect} />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToMovies}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Movies
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Select Theater & Show Time</h2>
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
