import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId) => {
    try {
      // Check profiles table (admin / member)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
        setHotel(null);
        return;
      }

      // Check hotels table (hotel user)
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (hotelData) {
        setProfile({
          id: userId,
          role: 'hotel',
          full_name: hotelData.contact_person,
          email: hotelData.email,
          status: hotelData.status,
        });
        setHotel(hotelData);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Only re-fetch if profile isn't already loaded for this user
          // This prevents the duplicate-call race condition
        } else {
          setUser(null);
          setProfile(null);
          setHotel(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  // Unified login: Member ID (e.g. K002098) OR Admin Email + password
  const loginMember = async (identifier, password) => {
    let email = identifier.trim();

    // If it doesn't look like an email, assume it's a Member ID
    if (!email.includes('@')) {
      const { data: lookedUpEmail, error: lookupError } = await supabase
        .rpc('get_email_by_member_id', { p_member_id: email.toUpperCase() });

      if (lookupError || !lookedUpEmail) {
        throw new Error('Member ID not found. Please check your ID and try again.');
      }
      email = lookedUpEmail;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid credentials. Please try again.');

    // Determine role (to check if admin)
    let role = 'member';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        role = profile.role;
      }
    } catch (err) {
      console.error('Error fetching role during login:', err);
    }

    // Fetch profile data for the newly logged-in user
    setUser(data.user);
    await fetchUserData(data.user.id);
    
    return { data, role };
  };

  // Hotel login: email + password
  const loginHotel = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid credentials. Please try again.');

    // Verify hotel is approved
    const { data: hotelData } = await supabase
      .from('hotels')
      .select('status')
      .eq('auth_user_id', data.user.id)
      .single();

    if (!hotelData) {
      await supabase.auth.signOut();
      throw new Error('Hotel account not found.');
    }

    if (hotelData.status !== 'verified') {
      await supabase.auth.signOut();
      throw new Error('Your hotel access has not been approved yet. Please wait for admin approval.');
    }

    // Fetch profile data for the newly logged-in hotel
    setUser(data.user);
    await fetchUserData(data.user.id);
    return data;
  };

  // Admin login: email + password
  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid credentials.');

    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!prof || prof.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('You are not authorized as admin.');
    }

    // Fetch profile data for the newly logged-in admin
    setUser(data.user);
    await fetchUserData(data.user.id);
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setHotel(null);
  };

  const value = {
    user,
    profile,
    hotel,
    loading,
    loginMember,
    loginHotel,
    loginAdmin,
    logout,
    refreshProfile: () => user && fetchUserData(user.id),
    isAdmin: profile?.role === 'admin',
    isHotel: profile?.role === 'hotel',
    isMember: profile?.role === 'member',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
