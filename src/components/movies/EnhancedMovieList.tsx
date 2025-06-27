
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedMovieCard } from './EnhancedMovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

interface EnhancedMovieListProps {
  onMovieSelect: (movieId: string) => void;
}

export const EnhancedMovieList = ({ onMovieSelect }: EnhancedMovieListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'release_date'>('title');

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'active')
        .order(sortBy);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading movies. Please try again.</p>
      </div>
    );
  }

  // Get all unique genres
  const allGenres = [...new Set(movies?.flatMap(movie => movie.genre) || [])];

  // Filter movies
  const filteredMovies = movies?.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-red-900">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-red-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGenre === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(null)}
              className={selectedGenre === null ? "bg-red-600" : "border-red-500 text-red-400"}
            >
              All
            </Button>
            {allGenres.slice(0, 6).map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? "bg-red-600" : "border-red-500 text-red-400"}
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-red-500 text-red-400"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedGenre) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-red-900">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchQuery && (
              <Badge variant="outline" className="border-red-500 text-red-400">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedGenre && (
              <Badge variant="outline" className="border-red-500 text-red-400">
                Genre: {selectedGenre}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-gray-400">
        Showing {filteredMovies.length} of {movies?.length || 0} movies
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No movies found matching your criteria.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredMovies.map((movie) => (
            <EnhancedMovieCard
              key={movie.id}
              movie={movie}
              onSelect={onMovieSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
