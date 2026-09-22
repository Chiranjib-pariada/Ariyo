import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, FacultyProfile, UserRole } from '../types';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

interface AuthContextType {
  user: User | null;
  profileRecord: StudentProfile | FacultyProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRoleDemo: (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => Promise<void>;
  updateUserContext: (user: User, profileRecord?: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => offlineStorage.get<User>('user_session'));
  const [profileRecord, setProfileRecord] = useState<any>(() => offlineStorage.get<any>('profile_session'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('ariyo_auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<{ user: User; profileRecord: any }>('/api/auth/me');
        if (res && res.user) {
          setUser(res.user);
          setProfileRecord(res.profileRecord);
          offlineStorage.save('user_session', res.user);
          offlineStorage.save('profile_session', res.profileRecord);
        }
      } catch (err) {
        // If offline or failed, we keep the offlineStorage data
        console.warn('Auth verification fallback to offline state:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{
        user: User;
        profileRecord: any;
        token: string;
      }>('/api/auth/login', { email, password });

      localStorage.setItem('ariyo_auth_token', res.token);
      setUser(res.user);
      setProfileRecord(res.profileRecord);
      offlineStorage.save('user_session', res.user);
      offlineStorage.save('profile_session', res.profileRecord);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post<{
        user: User;
        profileRecord: any;
        token: string;
      }>('/api/auth/register', data);

      localStorage.setItem('ariyo_auth_token', res.token);
      setUser(res.user);
      setProfileRecord(res.profileRecord);
      offlineStorage.save('user_session', res.user);
      offlineStorage.save('profile_session', res.profileRecord);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ariyo_auth_token');
    offlineStorage.remove('user_session');
    offlineStorage.remove('profile_session');
    setUser(null);
    setProfileRecord(null);
  };

  const switchRoleDemo = async (targetRole: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    let email = 'student@ariyo.edu';
    if (targetRole === 'FACULTY') email = 'ananya.sen@ariyo.edu';
    if (targetRole === 'ADMIN') email = 'admin@ariyo.edu';

    await login(email, 'Ariyo@2026');
  };

  const updateUserContext = (updatedUser: User, updatedProfile?: any) => {
    setUser(updatedUser);
    offlineStorage.save('user_session', updatedUser);
    if (updatedProfile) {
      setProfileRecord(updatedProfile);
      offlineStorage.save('profile_session', updatedProfile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profileRecord,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRoleDemo,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
