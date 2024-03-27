import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL, // Base URL of your API
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you may need
  },
});

export default api;
