import axios from "axios";

const instance = axios.create({
  baseURL: "/api", // relative to Next.js frontend
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
