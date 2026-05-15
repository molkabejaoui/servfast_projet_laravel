import api from './axiosConfig';

export const messagesApi = {
  // Contacts reçus (prestataire)
  getReceived: async () => {
    const response = await api.get('/contacts/received');
    return response.data;
  },

  // Contacts envoyés (client)
  getSent: async () => {
    const response = await api.get('/contacts/sent');
    return response.data;
  },

  // Contacter un prestataire via son service
  sendMessage: async (serviceId: string, data: {
    message: string;
    phone?: string;
    email?: string;
  }) => {
    const response = await api.post(`/services/${serviceId}/contact`, data);
    return response.data;
  },

  markRead: async (contactId: string) => {
    await api.patch(`/contacts/${contactId}/read`);
  },
};