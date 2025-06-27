
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TheaterSelectionProps {
  movieId: string;
  onTheaterSelect: (theaterId: string, showId: string) => void;
}

export const TheaterSelection = ({ movieId, onTheaterSelect }: TheaterSelectionProps) => {
  const { data: showsData, isLoading, error } = useQuery({
    queryKey: ['shows', movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select(`
          *,
          theaters (
            id,
            name,
            location,
            city,
            facilities
          ),
          screens (
            id,
            screen_number,
            screen_type
          )
        `)
        .eq('movie_id', movieId)
        .eq('status', 'active')
        .gte('show_date', new Date().toISOString().split('T')[0])
        .order('show_date')
        .order('show_time');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !showsData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load theaters. Please try again.</p>
      </div>
    );
  }

  // Group shows by theater
  const theaterGroups = showsData.reduce((acc, show) => {
    const theaterId = show.theaters?.id;
    if (!theaterId) return acc;
    
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theaters,
        shows: []
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {} as Record<string, { theater: any; shows: any[] }>);

  if (Object.keys(theaterGroups).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No shows available for this movie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.values(theaterGroups).map(({ theater, shows }) => (
        <Card key={theater.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{theater.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{theater.location}, {theater.city}</span>
                </div>
              </div>
            </CardTitle>
            {theater.facilities && theater.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {theater.facilities.map((facility: string) => (
                  <Badge key={facility} variant="outline" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Group shows by date */}
              {Object.entries(
                shows.reduce((acc, show) => {
                  const date = show.show_date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(show);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([date, dateShows]) => (
                <div key={date}>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dateShows.map((show) => (
                      <Button
                        key={show.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onTheaterSelect(theater.id, show.id)}
                        className="flex flex-col items-center p-3 h-auto"
                      >
                        <span className="font-medium">
                          {new Date(`1970-01-01T${show.show_time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                        <span className="text-xs text-gray-600">
                          ₹{show.price}
                        </span>
                        <span className="text-xs text-green-600">
                          {show.available_seats} seats
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
