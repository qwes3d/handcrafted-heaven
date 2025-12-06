import axios from "axios";

const isServer = typeof window === "undefined";

const instance = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_SITE_URL + "/api" // during build or SSR
    : "/api",                                  // in browser
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
