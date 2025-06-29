
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Calendar, Star, Users, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { canWatchContent } from '@/lib/subscription';
import { UpgradePlanModal } from '@/components/subscription/UpgradePlanModal';

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  release_date: string;
  poster_url: string;
  video_url: string;
  required_plan_level?: number;
}

interface EnhancedMovieCardProps {
  movie: Movie;
  onWatch: (movieId: string) => void;
}

export const EnhancedMovieCard = ({ movie, onWatch }: EnhancedMovieCardProps) => {
  const { user } = useAuth();
  const [canWatch, setCanWatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    checkWatchAccess();
  }, [user, movie.required_plan_level]);

  const checkWatchAccess = async () => {
    if (!user) {
      setCanWatch(false);
      setLoading(false);
      return;
    }

    try {
      const hasAccess = await canWatchContent(user.id, movie.required_plan_level || 1);
      setCanWatch(hasAccess);
    } catch (error) {
      console.error('Error checking watch access:', error);
      setCanWatch(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchClick = () => {
    if (canWatch) {
      onWatch(movie.id);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getRequiredPlanBadge = (level: number) => {
    switch (level) {
      case 1:
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">Basic</Badge>;
      case 2:
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300">Standard</Badge>;
      case 3:
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Premium</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden bg-gray-900/50 border-gray-800 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url || '/placeholder.svg'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Premium Badge */}
          {movie.required_plan_level && movie.required_plan_level > 1 && (
            <div className="absolute top-2 right-2">
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="lg"
              onClick={handleWatchClick}
              disabled={loading}
              className={`rounded-full w-16 h-16 ${
                canWatch 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } shadow-lg`}
            >
              <Play className="h-6 w-6 text-white" fill="white" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-white line-clamp-1">{movie.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="outline" className="text-xs border-red-500/50 text-red-300">
                {g}
              </Badge>
            ))}
            {movie.required_plan_level && getRequiredPlanBadge(movie.required_plan_level)}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(movie.release_date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span>{movie.rating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          
          <Button
            onClick={handleWatchClick}
            disabled={loading}
            className={`w-full ${
              canWatch 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {loading ? 'Loading...' : canWatch ? 'Watch Now' : 'Upgrade to Watch'}
          </Button>
        </CardContent>
      </Card>

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};
