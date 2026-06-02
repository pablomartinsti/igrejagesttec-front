import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PASTOR';
};

type Church = {
  id: string;
  name: string;
};

type AuthContextData = {
  user: User | null;
  church: Church | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('@igrejagesttec:user');
    return stored ? JSON.parse(stored) : null;
  });

  const [church, setChurch] = useState<Church | null>(() => {
    const stored = localStorage.getItem('@igrejagesttec:church');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@igrejagesttec:token');
  });

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user, church } = response.data;

    localStorage.setItem('@igrejagesttec:token', token);
    localStorage.setItem('@igrejagesttec:user', JSON.stringify(user));
    localStorage.setItem('@igrejagesttec:church', JSON.stringify(church));

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setToken(token);
    setUser(user);
    setChurch(church);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@igrejagesttec:token');
    localStorage.removeItem('@igrejagesttec:user');
    localStorage.removeItem('@igrejagesttec:church');

    api.defaults.headers.common['Authorization'] = '';

    setToken(null);
    setUser(null);
    setChurch(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        church,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
