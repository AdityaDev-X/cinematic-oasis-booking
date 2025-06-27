
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const signUp = async (
  email: string, 
  password: string, 
  fullName: string,
  additionalData?: { phone?: string; city?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: fullName,
        phone: additionalData?.phone || '',
        city: additionalData?.city || '',
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
