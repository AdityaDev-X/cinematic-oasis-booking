
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export const signUp = async (
  email: string, 
  password: string, 
  fullName: string,
  additionalData?: { phone?: string; city?: string }
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      fullName,
      phone: additionalData?.phone || '',
      city: additionalData?.city || '',
      createdAt: new Date().toISOString()
    });

    return { data: { user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message } };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
