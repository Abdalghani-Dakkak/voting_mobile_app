import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'quickvoting.mockSession';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const fakeAddress = () =>
  '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserRole(parsed.role);
          setUserAddress(parsed.address);
          setUserEmail(parsed.email);
        } else {
          setUserRole('Guest');
        }
      })
      .catch(() => setUserRole('Guest'))
      .finally(() => setReady(true));
  }, []);

  const isConnected = userRole !== null && userRole !== 'Guest';

  const connectWallet = async (role = 'User') => {
    const address = fakeAddress();
    const email = 'demo.user@quickvoting.app';
    setUserRole(role);
    setUserAddress(address);
    setUserEmail(email);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ role, address, email }));
    return { address, role, email };
  };

  const disconnect = async () => {
    setUserRole('Guest');
    setUserAddress(null);
    setUserEmail(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ userRole, userAddress, userEmail, isConnected, ready, connectWallet, disconnect }}
    >
      {children}
    </AuthContext.Provider>
  );
}
