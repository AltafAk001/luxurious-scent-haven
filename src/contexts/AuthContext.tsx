
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define user roles
export type UserRole = 'user' | 'admin' | 'ads_admin';

// Extended user type with role
export interface ExtendedUser extends User {
  role?: UserRole;
  user_metadata: {
    username?: string;
    first_name?: string;
    last_name?: string;
    role?: UserRole;
    newsletter?: boolean;
  } & Record<string, any>;
}

type AuthContextType = {
  session: Session | null;
  user: ExtendedUser | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isAdsAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const role = session.user.user_metadata?.role || 'user';
        setUserRole(role as UserRole);
        setUser(session.user as ExtendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          const role = session.user.user_metadata?.role || 'user';
          setUserRole(role as UserRole);
          setUser(session.user as ExtendedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // After successful sign-in, update the role
    if (data.user) {
      const role = data.user.user_metadata?.role || 'user';
      setUserRole(role as UserRole);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    // Default role is 'user' for new sign-ups
    const userMetadata = { ...userData, role: 'user' };
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userMetadata
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserRole('user');
  };

  const isAdmin = () => userRole === 'admin';
  const isAdsAdmin = () => userRole === 'ads_admin';

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userRole,
      loading, 
      signIn, 
      signUp, 
      signOut,
      isAdmin,
      isAdsAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
