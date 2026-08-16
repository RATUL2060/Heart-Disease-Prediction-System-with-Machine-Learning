import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cardiocare_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Helper to handle errors uniformly
const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.detail || 'Server error occurred.');
  } else if (error.request) {
    throw new Error('Unable to connect to the server. Please ensure the backend is running on port 8000.');
  } else {
    throw new Error('An unexpected error occurred.');
  }
};

// ---- Auth ----
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (e) { handleError(e); }
};

export const register = async (email, fullName, password) => {
  try {
    const response = await apiClient.post('/auth/register', {
      email,
      full_name: fullName,
      password,
    });
    return response.data;
  } catch (e) { handleError(e); }
};

// ---- Prediction ----
export const predictHeartDisease = async (patientData) => {
  try {
    const response = await apiClient.post('/predict', patientData);
    return response.data;
  } catch (e) { handleError(e); }
};

// ---- Patients ----
export const getPatients = async () => {
  try {
    const response = await apiClient.get('/patients/');
    return response.data;
  } catch (e) { handleError(e); }
};

export const createPatient = async (data) => {
  try {
    const response = await apiClient.post('/patients/', data);
    return response.data;
  } catch (e) { handleError(e); }
};

export const updatePatient = async (id, data) => {
  try {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  } catch (e) { handleError(e); }
};

export const deletePatient = async (id) => {
  try {
    await apiClient.delete(`/patients/${id}`);
  } catch (e) { handleError(e); }
};

// ---- History & Stats ----
export const getHistory = async () => {
  try {
    const response = await apiClient.get('/history/');
    return response.data;
  } catch (e) { handleError(e); }
};

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/history/stats');
    return response.data;
  } catch (e) { handleError(e); }
};
