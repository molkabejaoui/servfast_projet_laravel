import api from './axiosConfig';

export const ratingsApi = {
  // ← /ratings/service/:id → /services/:id/ratings
  getServiceRatings: async (serviceId: string) => {
    const response = await api.get(`/services/${serviceId}/ratings`);
    return response.data;
  },

  submit: async (serviceId: string, data: { score: number; comment?: string }) => {
    const response = await api.post(`/services/${serviceId}/ratings`, data);
    return response.data;
  },

  delete: async (ratingId: string) => {
    await api.delete(`/ratings/${ratingId}`);
  },
};