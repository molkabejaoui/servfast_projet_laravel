import api from './axiosConfig';

export const usersApi = {
  getProfile: async () => {
    const response = await api.get('/me'); // ← /users/profile → /me
    return response.data;
  },

  updateProfile: async (userData: FormData | object) => {
    const response = await api.post('/me', userData); // ← PUT → POST
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(currentUser),
        ...response.data.user
      }));
    }
    return response.data;
  },

  getProviderProfile: async () => {
    const response = await api.get('/provider/profile');
    return response.data;
  },

  updateProviderProfile: async (data: object) => {
    const response = await api.post('/provider/profile', data);
    return response.data;
  },
};