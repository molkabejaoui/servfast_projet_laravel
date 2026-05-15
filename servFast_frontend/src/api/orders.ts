import api from './axiosConfig';

// Laravel n'a pas de module orders séparé
// Les "orders" sont gérés via payments + contacts
export const ordersApi = {
  checkout: async (serviceId: string) => {
    const response = await api.post('/payments/checkout', { service_id: serviceId });
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
};