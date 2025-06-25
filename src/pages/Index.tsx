
import { useState } from "react";
import { Search, Calendar, MapPin, Star, Play, Users, Clock, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const { toast } = useToast();

  const handleBookNow = (movieTitle: string) => {
    toast({
      title: "Booking Initiated",
      description: `Taking you to book tickets for "${movieTitle}"`,
    });
    console.log(`Booking movie: ${movieTitle}`);
  };

  const handleNotifyMe = (movieTitle: string) => {
    toast({
      title: "Notification Set",
      description: `You'll be notified when "${movieTitle}" tickets are available`,
    });
    console.log(`Notify me for: ${movieTitle}`);
  };

  const handleLikeMovie = (movieId: number) => {
    setLikedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
    toast({
      title: likedMovies.includes(movieId) ? "Removed from favorites" : "Added to favorites",
      description: "Your favorites have been updated",
    });
  };

  const handleShareMovie = (movieTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${movieTitle}`,
        text: `Watch ${movieTitle} - Book tickets now on CineMax`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: `Link for "${movieTitle}" copied to clipboard`,
      });
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    toast({
      title: "City Changed",
      description: `Now showing movies in ${city}`,
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Looking for "${searchQuery}"`,
      });
      console.log(`Searching for: ${searchQuery}`);
    }
  };

  const featuredMovies = [
    {
      id: 1,
      title: "Dune: Part Two",
      rating: 8.7,
      genre: ["Sci-Fi", "Adventure", "Drama"],
      duration: "2h 46m",
      language: "English",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
      bookings: 1247,
      theaters: 156
    },
    {
      id: 2,
      title: "Oppenheimer",
      rating: 8.9,
      genre: ["Biography", "Drama", "History"],
      duration: "3h 1m",
      language: "English",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=600&fit=crop",
      bookings: 2341,
      theaters: 198
    },
    {
      id: 3,
      title: "Spider-Man: Across the Spider-Verse",
      rating: 9.1,
      genre: ["Animation", "Action", "Adventure"],
      duration: "2h 20m",
      language: "English",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=600&fit=crop",
      bookings: 3456,
      theaters: 245
    },
    {
      id: 4,
      title: "John Wick: Chapter 4",
      rating: 8.2,
      genre: ["Action", "Crime", "Thriller"],
      duration: "2h 49m",
      language: "English",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=600&fit=crop",
      bookings: 1876,
      theaters: 178
    }
  ];

  const upcomingMovies = [
    {
      id: 5,
      title: "The Batman II",
      releaseDate: "2025-10-03",
      genre: ["Action", "Crime", "Drama"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Avatar 3",
      releaseDate: "2025-12-20",
      genre: ["Sci-Fi", "Adventure", "Fantasy"],
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
                CineMax
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 relative group">
                  Movies
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#" className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 relative group">
                  Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#" className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 relative group">
                  Sports
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#" className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 relative group">
                  Activities
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search movies, events, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 hover:bg-white/15 transition-all duration-300"
                />
              </div>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
                onClick={() => handleCityChange(selectedCity === "Mumbai" ? "Delhi" : "Mumbai")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {selectedCity}
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500">
            Book Your Perfect
            <br />
            Movie Experience
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto hover:text-white/90 transition-colors duration-300">
            Discover the latest blockbusters, find the perfect seats, and create unforgettable memories with our premium booking experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              onClick={() => document.getElementById('movies-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5 mr-2" />
              Explore Movies
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              onClick={() => toast({ title: "Events Coming Soon", description: "Event booking feature will be available soon!" })}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Event
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section id="movies-section" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300">Now Playing</h3>
            <Button 
              variant="ghost" 
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 transition-all duration-300"
              onClick={() => toast({ title: "View All", description: "Showing all available movies" })}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <Card key={movie.id} className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Action buttons overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeMovie(movie.id);
                        }}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/80 transition-all duration-300"
                      >
                        <Heart className={`w-4 h-4 ${likedMovies.includes(movie.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareMovie(movie.title);
                        }}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-blue-500/80 transition-all duration-300"
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm font-medium">{movie.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white/80 text-sm mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {movie.duration}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {movie.genre.slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary" className="bg-white/20 text-white text-xs hover:bg-white/30 transition-colors duration-300">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {movie.title}
                    </h4>
                    <p className="text-white/60 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">{movie.language}</p>
                    
                    <div className="flex items-center justify-between text-sm text-white/70 mb-4">
                      <div className="flex items-center hover:text-white/90 transition-colors duration-300">
                        <Users className="w-4 h-4 mr-1" />
                        {movie.bookings} bookings
                      </div>
                      <div className="flex items-center hover:text-white/90 transition-colors duration-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        {movie.theaters} theaters
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      onClick={() => handleBookNow(movie.title)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Movies */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300">Coming Soon</h3>
            <Button 
              variant="ghost" 
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 transition-all duration-300"
              onClick={() => toast({ title: "View All", description: "Showing all upcoming movies" })}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMovies.map((movie) => (
              <Card key={movie.id} className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-48 flex-shrink-0 overflow-hidden">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          {movie.title}
                        </h4>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {movie.genre.map((g) => (
                            <Badge key={g} variant="secondary" className="bg-white/20 text-white text-xs hover:bg-white/30 transition-colors duration-300">
                              {g}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-white/70 mb-4 group-hover:text-white/90 transition-colors duration-300">
                          Get notified when tickets go live
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-white/80 group-hover:text-white/90 transition-colors duration-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">Releases {new Date(movie.releaseDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white hover:scale-105 transition-all duration-300"
                          onClick={() => handleNotifyMe(movie.title)}
                        >
                          Notify Me
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-300">
                CineMax
              </h4>
              <p className="text-white/70 text-sm hover:text-white/90 transition-colors duration-300">
                Your premium destination for movie bookings and entertainment experiences.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 hover:text-purple-300 transition-colors duration-300">Movies</h5>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Now Playing</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Coming Soon</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">IMAX</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">4DX</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 hover:text-purple-300 transition-colors duration-300">Support</h5>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Help Center</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Contact Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4 hover:text-purple-300 transition-colors duration-300">Connect</h5>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Facebook</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Twitter</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">Instagram</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all duration-300 block">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm hover:text-white/80 transition-colors duration-300">
            © 2024 CineMax. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
