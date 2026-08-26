import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

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
