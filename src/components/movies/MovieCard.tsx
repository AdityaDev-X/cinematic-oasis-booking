
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, Calendar } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Movie = Tables<'movies'>;

interface MovieCardProps {
  movie: Movie;
  onBookNow: (movieId: string) => void;
}

export const MovieCard = ({ movie, onBookNow }: MovieCardProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] bg-gray-200 relative">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{movie.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(movie.duration)}</span>
            <span>•</span>
            <span>{movie.language}</span>
          </div>
          
          {movie.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{movie.rating}/10</span>
            </div>
          )}
          
          {movie.release_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {movie.genre.map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => onBookNow(movie.id)} 
          className="w-full"
          size="sm"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};
