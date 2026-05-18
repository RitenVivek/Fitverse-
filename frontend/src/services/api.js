const API_BASE = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('fitverse_token');
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('fitverse_token', token);
    else localStorage.removeItem('fitverse_token');
  }

  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        this.setToken(null);
        window.location.href = '/';
      }
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // Auth
  signup(data) { return this.post('/auth/signup', data); }
  login(data) { return this.post('/auth/login', data); }
  getMe() { return this.get('/auth/me'); }

  // User
  updateProfile(data) { return this.put('/user/profile', data); }
  getMetrics() { return this.get('/user/metrics'); }

  // Dashboard
  getTodayLog() { return this.get('/dashboard/today'); }
  saveLog(data) { return this.post('/dashboard/log', data); }
  getHistory(days = 30) { return this.get(`/dashboard/history?days=${days}`); }
  getSummary() { return this.get('/dashboard/summary'); }

  // Diet
  getDietPlans() { return this.get('/diet'); }
  getActiveDiet() { return this.get('/diet/active'); }
  createDiet(data) { return this.post('/diet', data); }
  updateDiet(id, data) { return this.put(`/diet/${id}`, data); }
  deleteDiet(id) { return this.delete(`/diet/${id}`); }
  generateDiet() { return this.post('/diet/generate', {}); }
  addMealItem(planId, mealType, item) { return this.post(`/diet/${planId}/meal`, { mealType, item }); }

  // Workouts
  getWorkouts(limit = 20) { return this.get(`/workouts?limit=${limit}`); }
  logWorkout(data) { return this.post('/workouts', data); }
  deleteWorkout(id) { return this.delete(`/workouts/${id}`); }

  // Progress
  addWeight(data) { return this.post('/progress/weight', data); }
  getWeightHistory(days = 90) { return this.get(`/progress/weight?days=${days}`); }
  getChartData(days = 30) { return this.get(`/progress/charts?days=${days}`); }

  // ML
  getWeightPrediction() { return this.get('/ml/predict-weight'); }
  getInsights() { return this.get('/ml/insights'); }
  getCalorieRecommendation() { return this.get('/ml/calorie-recommendation'); }
}

const api = new ApiService();
export default api;
