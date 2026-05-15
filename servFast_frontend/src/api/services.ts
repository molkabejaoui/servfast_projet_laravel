import api from './axiosConfig';

export const servicesApi = {
  getAll: async (params?: {
    category_id?: number;
    city?: string;
    search?: string;
  }) => {
    const response = await api.get('/services', { params });
    return response.data.data; // ← Laravel paginate retourne .data
  },

  getById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (serviceData: FormData) => {
    const response = await api.post('/services', serviceData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // pour les photos
    });
    return response.data;
  },

  update: async (id: string, serviceData: object) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/services/${id}`);
  },

  myServices: async () => {
    const response = await api.get('/my-services');
    return response.data;
  },

  save: async (id: string) => {
    const response = await api.post(`/services/${id}/save`);
    return response.data;
  },

  unsave: async (id: string) => {
    await api.delete(`/services/${id}/unsave`);
  },

  getSaved: async () => {
    const response = await api.get('/saved-services');
    return response.data;
  },
};