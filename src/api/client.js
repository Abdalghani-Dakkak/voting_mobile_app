import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

let refreshPromise = null;

function doRefresh() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original?._retried && !original?.url?.includes('/auth/')) {
      original._retried = true;
      try {
        await doRefresh();
        return api(original);
      } catch {
        // fall through to the error below
      }
    }
    const message =
      err.response?.data?.error || err.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

// ---------------------------------------------------------------------------
// Authentication (Web3Auth wallet-signature flow — see src/context/AuthContext.jsx)
// ---------------------------------------------------------------------------
export async function getAuthChallenge(address) {
  const res = await api.post('/auth/challenge', { address });
  return res.data;
}

export async function verifyAuth({ address, signature, nonce }) {
  const res = await api.post('/auth/verify', { address, signature, nonce });
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function syncRole(role) {
  const res = await api.post('/auth/me/role', { role });
  return res.data;
}

export async function logoutRequest() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function updateSelf(body) {
  const res = await api.patch('/users/me', body);
  return res.data;
}

export async function fetchPolls(params = {}) {
  const res = await api.get('/polls', { params });
  return res.data;
}

export async function fetchPollDetails(pollId) {
  const res = await api.get(`/polls/${pollId}`);
  return res.data;
}

export async function createPoll(body) {
  const res = await api.post('/polls', body);
  return res.data;
}

export async function fetchCandidates(params = {}) {
  const res = await api.get('/candidates', { params });
  return res.data;
}

export async function createCandidate(body) {
  const res = await api.post('/candidates', body);
  return res.data;
}

export async function fetchTallyResult(idOrPollId) {
  const res = await api.get(`/tally-results/${idOrPollId}`);
  return res.data;
}

export async function castVote(body) {
  const res = await api.post('/votes', body);
  return res.data;
}

export default api;
