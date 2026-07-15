import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://freelance-marketplace-backend-vy1m.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Uploaded files are stored as server-relative paths ("/uploads/samples/x.png").
// This resolves them against the API origin, and leaves absolute URLs untouched.
export const fileUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL.replace(/\/api\/?$/, "")}${url}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
