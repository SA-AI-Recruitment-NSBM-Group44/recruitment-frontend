import { createContext, useContext, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import client from '../api/client.js';

const AuthContext = createContext(null);

// Where each role lands right after login.
export const ROLE_HOME = {
  Candidate: '/candidate/dashboard',
  Recruiter: '/recruiter/dashboard',
  HiringManager: '/manager/shortlist',
  Admin: '/admin/users'
};

function readUserFromStorage() {
  const token = localStorage.getItem('recruitai_token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('recruitai_token');
      return null;
    }
    const roleRaw =
      decoded.role ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['role'];

    let role = roleRaw;
    if (roleRaw) {
      const lower = roleRaw.toLowerCase().replace(/\s+/g, '');
      if (lower === 'hiringmanager') role = 'HiringManager';
      else if (lower === 'admin') role = 'Admin';
      else if (lower === 'recruiter') role = 'Recruiter';
      else if (lower === 'candidate') role = 'Candidate';
    }

    const sub = decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const email = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    const name = decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || email || 'User';

    return { id: sub, name, email, role };
  } catch {
    localStorage.removeItem('recruitai_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUserFromStorage);

  const login = async (email, password) => {
    const { data } = await client.post('/api/auth/login', { email, password });
    localStorage.setItem('recruitai_token', data.data.token);
    const nextUser = readUserFromStorage();
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const { data } = await client.post('/api/auth/register', payload);
    localStorage.setItem('recruitai_token', data.data.token);
    const nextUser = readUserFromStorage();
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem('recruitai_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
