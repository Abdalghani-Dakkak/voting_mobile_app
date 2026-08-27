import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  AUTH_CONNECTION,
} from '@web3auth/react-native-sdk';
import {
  getAuthChallenge,
  verifyAuth,
  fetchCurrentUser,
  syncRole,
  logoutRequest,
} from '../api/client';
import { getUserRoleFromChain } from '../chain/readFromChain';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Backend roles are lowercase ("user", "organization", ...); the UI displays them
// capitalized (matches the web app's role badges/gating checks like `userRole === 'Organization'`).
const displayRole = (role) => {
  if (!role) return 'Guest';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export function AuthProvider({ children }) {
  const { isInitialized, connection } = useWeb3Auth();
  const { connectTo, loading: connecting, error: connectError } = useWeb3AuthConnect();
  const { disconnect: web3authDisconnect } = useWeb3AuthDisconnect();

  const [userRole, setUserRole] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const hydrateFromBackend = useCallback(async () => {
    try {
      const { user } = await fetchCurrentUser();
      setUserRole(displayRole(user.role));
      setUserAddress(user.walletAddress);
      setUserEmail(user.email);
      setUserFullName(user.fullName || null);
      return true;
    } catch {
      setUserRole('Guest');
      setUserAddress(null);
      setUserEmail(null);
      setUserFullName(null);
      return false;
    }
  }, []);

  // On boot: Web3Auth restores a persisted session (SecureStore) before isInitialized flips true.
  // If it restored a wallet session, our own backend cookie session may or may not still be valid
  // (they have independent lifetimes), so we always double check with /auth/me.
  useEffect(() => {
    if (!isInitialized) return;
    hydrateFromBackend().finally(() => setReady(true));
  }, [isInitialized, hydrateFromBackend]);

  const isConnected = userRole !== null && userRole !== 'Guest';

  const loginWithWallet = async (authConnection, extraLoginOptions) => {
    setAuthError(null);
    const conn = await connectTo({ authConnection, extraLoginOptions });
    const providerSource = conn?.ethereumProvider ?? connection?.ethereumProvider;
    if (!providerSource) {
      throw new Error('Web3Auth did not return a wallet provider.');
    }

    const provider = new ethers.BrowserProvider(providerSource);
    const accounts = await providerSource.request({ method: 'eth_accounts' });
    const address = accounts?.[0] ?? (await (await provider.getSigner()).getAddress());
    const signer = await provider.getSigner(address);
    const signerAddress = await signer.getAddress();

    const challenge = await getAuthChallenge(signerAddress);
    const domain = challenge.domain || 'localhost';
    const message = `Sign this message to authenticate with ${domain}\n\nNonce: ${challenge.nonce}`;
    const signature = await signer.signMessage(message);

    await verifyAuth({ nonce: challenge.nonce, address: signerAddress, signature });

    try {
      const chainRole = await getUserRoleFromChain(signerAddress);
      await syncRole((chainRole || 'user').toLowerCase());
    } catch (err) {
      console.warn('Role sync failed (non-blocking):', err.message);
    }

    await hydrateFromBackend();
  };

  const loginWithGoogle = () => loginWithWallet(AUTH_CONNECTION.GOOGLE);

  const loginWithEmail = (email) =>
    loginWithWallet(AUTH_CONNECTION.EMAIL_PASSWORDLESS, { login_hint: email });

  const connectWallet = async (authConnection, options) => {
    try {
      if (authConnection === 'email') {
        await loginWithEmail(options?.email);
      } else {
        await loginWithGoogle();
      }
    } catch (err) {
      console.error('Web3Auth login failed:', err);
      setAuthError(err.message || 'Login failed. Please try again.');
      throw err;
    }
  };

  const disconnect = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.warn('Backend logout failed (continuing):', err.message);
    }
    try {
      await web3authDisconnect();
    } catch (err) {
      console.warn('Web3Auth disconnect failed (continuing):', err.message);
    }
    setUserRole('Guest');
    setUserAddress(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userAddress,
        userEmail,
        userFullName,
        isConnected,
        ready: ready && isInitialized,
        connecting,
        authError: authError || connectError?.message || null,
        connectWallet,
        loginWithGoogle,
        loginWithEmail,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
