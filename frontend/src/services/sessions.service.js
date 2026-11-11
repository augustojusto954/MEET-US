// frontend/src/services/sessions.service.js
import { api } from 'src/boot/axios';

export const sessionsService = {
  async getSessions(params = {}) {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  async getSessionById(id) {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  async createSession(payload) {
    const response = await api.post('/sessions', payload);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.put(`/sessions/${id}/status`, { status });
    return response.data;
  },

  async joinSession(id, payload = {}) {
    const response = await api.post(`/sessions/${id}/join`, payload);
    return response.data;
  },

  async leaveSession(id, payload = {}) {
    const response = await api.post(`/sessions/${id}/leave`, payload);
    return response.data;
  },

  async kickParticipant(id, targetUserId) {
    const response = await api.post(`/sessions/${id}/kick`, { targetUserId });
    return response.data;
  },

  async sendChatMessage(id, text) {
    const response = await api.post(`/sessions/${id}/chat`, { text });
    return response.data;
  }
};
