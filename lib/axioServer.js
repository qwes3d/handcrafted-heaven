import axios from "axios";

const axiosServer = axios.create({
  baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  timeout: 15000,
});

export default axiosServer;
