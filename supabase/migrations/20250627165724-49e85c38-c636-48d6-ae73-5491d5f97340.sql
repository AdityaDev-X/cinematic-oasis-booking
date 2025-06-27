
-- Create enum types for better data integrity
CREATE TYPE show_status AS ENUM ('active', 'cancelled', 'completed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE seat_status AS ENUM ('available', 'booked', 'blocked');

-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  total_screens INTEGER NOT NULL DEFAULT 1,
  facilities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT[] NOT NULL,
  language TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  rating DECIMAL(3,1),
  release_date DATE,
  poster_url TEXT,
  trailer_url TEXT,
  cast_members TEXT[],
  director TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create screens table
CREATE TABLE public.screens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theater_id UUID REFERENCES public.theaters(id) ON DELETE CASCADE NOT NULL,
  screen_number INTEGER NOT NULL,
  screen_type TEXT DEFAULT 'regular', -- regular, imax, 4dx, etc.
  total_seats INTEGER NOT NULL,
  seating_layout JSONB, -- store seat arrangement
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(theater_id, screen_number)
);

-- Create shows table
CREATE TABLE public.shows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  screen_id UUID REFERENCES public.screens(id) ON DELETE CASCADE NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER NOT NULL,
  status show_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  city TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status booking_status DEFAULT 'pending',
  payment_id TEXT,
  seats_booked JSONB NOT NULL, -- array of seat numbers
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seats table for detailed seat management
CREATE TABLE public.seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  screen_id UUID REFERENCES public.screens(id) ON DELETE CASCADE NOT NULL,
  seat_number TEXT NOT NULL,
  seat_row TEXT NOT NULL,
  seat_type TEXT DEFAULT 'regular', -- regular, premium, recliner
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(screen_id, seat_number)
);

-- Create show_seats table for tracking seat availability per show
CREATE TABLE public.show_seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE NOT NULL,
  seat_id UUID REFERENCES public.seats(id) ON DELETE CASCADE NOT NULL,
  status seat_status DEFAULT 'available',
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(show_id, seat_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show_seats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to basic data
CREATE POLICY "Anyone can view theaters" ON public.theaters FOR SELECT USING (true);
CREATE POLICY "Anyone can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Anyone can view screens" ON public.screens FOR SELECT USING (true);
CREATE POLICY "Anyone can view shows" ON public.shows FOR SELECT USING (true);
CREATE POLICY "Anyone can view seats" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Anyone can view show_seats" ON public.show_seats FOR SELECT USING (true);

-- Create policies for user profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for development
INSERT INTO public.theaters (name, location, city, total_screens, facilities) VALUES
('PVR Cinemas', 'Phoenix Mall', 'Mumbai', 8, ARRAY['IMAX', '4DX', 'Recliner']),
('INOX', 'Select City Walk', 'Delhi', 6, ARRAY['IMAX', 'Premium']),
('Cinepolis', 'DLF Mall', 'Gurgaon', 5, ARRAY['4DX', 'VIP']);

INSERT INTO public.movies (title, description, genre, language, duration, rating, release_date, cast_members, director) VALUES
('Dune: Part Two', 'Epic sci-fi saga continues', ARRAY['Sci-Fi', 'Adventure', 'Drama'], 'English', 166, 8.7, '2024-03-01', ARRAY['Timothée Chalamet', 'Zendaya'], 'Denis Villeneuve'),
('Oppenheimer', 'The story of atomic bomb creator', ARRAY['Biography', 'Drama', 'History'], 'English', 181, 8.9, '2023-07-21', ARRAY['Cillian Murphy', 'Emily Blunt'], 'Christopher Nolan'),
('Spider-Man: Across the Spider-Verse', 'Animated Spider-Man adventure', ARRAY['Animation', 'Action', 'Adventure'], 'English', 140, 9.1, '2023-06-02', ARRAY['Shameik Moore', 'Hailee Steinfeld'], 'Joaquim Dos Santos'),
('John Wick: Chapter 4', 'Action-packed thriller', ARRAY['Action', 'Crime', 'Thriller'], 'English', 169, 8.2, '2023-03-24', ARRAY['Keanu Reeves', 'Donnie Yen'], 'Chad Stahelski');
