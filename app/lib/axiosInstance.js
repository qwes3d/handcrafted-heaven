
// File: lib/axiosInstance.js
import axios from 'axios';
const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export default axios.create({ baseURL: base })