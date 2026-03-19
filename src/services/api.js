import axios from "axios";

// Backend URL from environment variable
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://taskflow-t4tz.onrender.com/api";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://taskflow-t4tz.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
  (config) => {
    console.log(
      `API Request → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ================================
// TASK API ENDPOINTS
// ================================
export const taskAPI = {
  // Get all tasks
  getAllTasks: () => api.get("/tasks"),

  // Get task by ID
  getTaskById: (id) => api.get(`/tasks/${id}`),

  // Create task
  createTask: (task) => api.post("/tasks", task),

  // Update task
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),

  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  // Paginated tasks
  getPaginatedTasks: (page = 0, size = 10, sortBy = "id", direction = "ASC") =>
    api.get("/tasks/paginated", {
      params: { page, size, sortBy, direction },
    }),

  // Filter by status
  getTasksByStatus: (status) => api.get(`/tasks/status/${status}`),

  // Filter by priority
  getTasksByPriority: (priority) =>
    api.get(`/tasks/priority/${priority}`),

  // Search tasks
  searchTasks: (keyword) =>
    api.get("/tasks/search", {
      params: { keyword },
    }),

  // ================================
  // ✅ FIXED HEALTH CHECK (IMPORTANT)
  // ================================
  getHealth: async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/actuator/health`
      );

      // ✅ Correct parsing
      if (response.data.status === "UP") {
        return { status: "UP" };
      } else {
        return { status: "DOWN" };
      }
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "DOWN" };
    }
  },
};

export default api;