import axios from 'axios';
import Constants from 'expo-constants';

// Update this to your machine's LAN IP (or 10.0.2.2 for the Android emulator)
// so a physical device / emulator can reach the Express backend on your dev machine.
const API_BASE =
  Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

// ---------------------------------------------------------------------------
// Polls (public endpoints — no auth required by the backend)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Candidates (public GET — no auth required)
// ---------------------------------------------------------------------------
export async function fetchCandidates(params = {}) {
  const res = await api.get('/candidates', { params });
  return res.data;
}

export async function createCandidate(body) {
  const res = await api.post('/candidates', body);
  return res.data;
}

// ---------------------------------------------------------------------------
// Tally results (public GET — no auth required)
// ---------------------------------------------------------------------------
export async function fetchTallyResult(idOrPollId) {
  const res = await api.get(`/tally-results/${idOrPollId}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Votes (requires wallet/token auth on the real backend — mocked in this app)
// ---------------------------------------------------------------------------
export async function castVote(body) {
  const res = await api.post('/votes', body);
  return res.data;
}

export default api;
