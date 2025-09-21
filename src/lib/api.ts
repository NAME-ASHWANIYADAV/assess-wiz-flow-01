
const API_BASE = 'https://natwest-backend.onrender.com';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const apiCallWithAuth = async (endpoint: string, options: RequestInit = {}, token = null) => {
  const authToken = token || localStorage.getItem('token');
  if (!authToken) {
    throw new Error('No authentication token found. Please log in.');
  }
  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`,
    },
  });
};

export const apiUploadFile = async (endpoint: string, formData: FormData, token = null) => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
        throw new Error('No authentication token found. Please log in.');
    }
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
};
