
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User,
  updateProfile,
  sendEmailVerification
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
    console.log('Creating user with Firebase Auth...');
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    console.log('User created, updating profile...');
    // Update user profile
    await updateProfile(user, {
      displayName: fullName
    });

    console.log('Sending email verification...');
    // Send email verification
    await sendEmailVerification(user);

    console.log('Creating user document in Firestore...');
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      fullName,
      phone: additionalData?.phone || '',
      city: additionalData?.city || '',
      createdAt: new Date().toISOString(),
      emailVerified: false
    });

    return { data: { user }, error: null };
  } catch (error: any) {
    console.error('Firebase signup error:', error);
    return { data: null, error: { message: error.message } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with Firebase Auth...');
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    if (!user.emailVerified) {
      console.log('Email not verified, sending verification email...');
      await sendEmailVerification(user);
      return { 
        data: null, 
        error: { 
          message: "Please verify your email address. A new verification email has been sent." 
        } 
      };
    }
    
    return { data: { user }, error: null };
  } catch (error: any) {
    console.error('Firebase signin error:', error);
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
