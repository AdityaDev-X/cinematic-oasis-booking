
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Clock, Calendar, Heart } from 'lucide-react';
import { VideoBackground } from '@/components/ui/video-background';

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  release_date: string;
  poster_url: string;
  trailer_url?: string;
  director: string;
  cast_members: string[];
}

interface EnhancedMovieCardProps {
  movie: Movie;
  onSelect: (movieId: string) => void;
}

export const EnhancedMovieCard = ({ movie, onSelect }: EnhancedMovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden bg-black border-red-900 hover:border-red-500 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Background on Hover */}
      {isHovered && movie.trailer_url && (
        <VideoBackground 
          src={movie.trailer_url}
          className="absolute inset-0 z-0"
          overlay={true}
        />
      )}
      
      {/* Static Poster */}
      {(!isHovered || !movie.trailer_url) && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.poster_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      )}

      <CardContent className="relative z-10 p-0 h-80">
        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="bg-black/50 border-red-500 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500' : ''}`} />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-red-600 text-white flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {movie.rating}/10
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {movie.duration}min
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(movie.release_date).getFullYear()}
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 3).map((genre) => (
              <Badge 
                key={genre} 
                variant="outline" 
                className="text-xs border-red-500 text-red-400"
              >
                {genre}
              </Badge>
            ))}
          </div>

          {/* Description - Only show on hover */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(movie.id);
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Book Now
            </Button>
            {movie.trailer_url && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
