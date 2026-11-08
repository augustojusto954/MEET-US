// frontend/src/services/profile.service.js
import { fakeUsers, fakeSkills, fakeInterests } from './fake-api'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

export const profileService = {
  getById: (id) => (USE_FAKE ? fakeUsers.getById(id) : api.get(`/users/${id}`)),
  update: (id, patch) => (USE_FAKE ? fakeUsers.update(id, patch) : api.put(`/users/${id}`, patch)),
  listSkills: (userId) => (USE_FAKE ? fakeSkills.listByUser(userId) : api.get(`/users/${userId}/skills`)),
  addSkill: (userId, data) => (USE_FAKE ? fakeSkills.add(userId, data) : api.post(`/users/${userId}/skills`, data)),
  removeSkill: (userId, skillId) => (USE_FAKE ? fakeSkills.remove(skillId) : api.delete(`/users/${userId}/skills/${skillId}`)),
  listInterests: (userId) => (USE_FAKE ? fakeInterests.listByUser(userId) : api.get(`/users/${userId}/interests`)),
  addInterest: (userId, name) => (USE_FAKE ? fakeInterests.add(userId, name) : api.post(`/users/${userId}/interests`, { name })),
  removeInterest: (userId, name) => (USE_FAKE ? fakeInterests.remove(name) : api.delete(`/users/${userId}/interests/${encodeURIComponent(name)}`))
}
