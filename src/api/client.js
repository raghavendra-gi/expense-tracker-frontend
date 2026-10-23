const API_BASE = '/api'; // The Vite proxy forwards this to http://127.0.0.1:8000

export async function expenseAPI(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  let data = null;
  try { 
    data = await response.json(); 
  } catch (e) { 
    /* empty or non-JSON body */ 
  }

  if (response.status === 401) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_user');
  window.dispatchEvent(new Event('auth-error')); // Fire an event
  throw new Error('Session expired. Please sign in again.');
}

  if (!response.ok) {
    throw new Error((data && data.detail) || 'API request failed');
  }

  return data;
}