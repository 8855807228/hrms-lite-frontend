import axios from 'axios';

// Base API client for all backend requests
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Employee endpoints
export const employeeAPI = {
    getAll: () => api.get('/employees'),
    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    delete: (id) => api.delete(`/employees/${id}`),
};

// Attendance endpoints
export const attendanceAPI = {
    getByEmployee: (employeeId, params = {}) =>
        api.get(`/employees/${employeeId}/attendance`, { params }),
    mark: (employeeId, data) =>
        api.post(`/employees/${employeeId}/attendance`, data),
    getSummary: (employeeId) =>
        api.get(`/employees/${employeeId}/attendance/summary`),
};

// Dashboard endpoint
export const dashboardAPI = {
    getSummary: () => api.get('/dashboard'),
};

export default api;
