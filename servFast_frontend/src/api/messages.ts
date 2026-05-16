import api from './axiosConfig';

// ── Normalisation centralisée ────────────────────────────────────
// Garantit que sender_id / receiver_id sont TOUJOURS des strings.
// Appliqué à chaque message retourné par le backend.
function normalizeMsg(msg: any): any {
  return {
    ...msg,
    sender_id:   String(msg.sender_id   ?? ''),
    receiver_id: String(msg.receiver_id ?? ''),
  };
}

export const messagesApi = {
  // ── Messages reçus ──────────────────────────────────────────────
  getReceived: async () => {
    const response = await api.get('/contacts/received');
    const data = response.data;
    return (Array.isArray(data) ? data : []).map(normalizeMsg);
  },

  // ── Messages envoyés ────────────────────────────────────────────
  getSent: async () => {
    const response = await api.get('/contacts/sent');
    const data = response.data;
    return (Array.isArray(data) ? data : []).map(normalizeMsg);
  },

  // ── Premier contact via page service ────────────────────────────
  sendMessage: async (serviceId: string, data: {
    message: string;
    phone?: string;
    email?: string;
  }) => {
    const response = await api.post(`/services/${serviceId}/contact`, data);
    return response.data;
  },

  // ── Profil public d'un utilisateur ──────────────────────────────
  getUserProfile: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch {
      return null;
    }
  },

  // ── Tous les messages d'une conversation ────────────────────────
  // sender_id / receiver_id normalisés en string
  getConversation: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/conversations/${userId}`);
    const data = response.data;
    return (Array.isArray(data) ? data : []).map(normalizeMsg);
  },

  // ── Répondre dans une conversation ──────────────────────────────
  // Retourne { message: string, contact: NormalizedContact }
  reply: async (userId: string, data: { message: string; service_id?: string }) => {
    const response = await api.post(`/conversations/${userId}/reply`, data);
    const res = response.data;

    // Normaliser le contact retourné
    if (res?.contact) {
      res.contact = normalizeMsg(res.contact);
    }

    return res; // { message: '...', contact: { id, sender_id (string), ... } }
  },

  // ── Marquer comme lu ────────────────────────────────────────────
  markRead: async (contactId: string) => {
    await api.patch(`/contacts/${contactId}/read`);
  },

  // ── Notifications non lues ──────────────────────────────────────
  // Retourne { count, notifications }
  getNotifications: async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return { count: response.data.count ?? 0, notifications: [] };
  } catch {
    return { count: 0, notifications: [] };
  }
},

  // ── Toutes les conversations groupées par interlocuteur ─────────
  getAllConversations: async () => {
    const [sent, received] = await Promise.all([
      api.get('/contacts/sent').then(r => r.data),
      api.get('/contacts/received').then(r => r.data),
    ]);

    const sentArr:     any[] = (Array.isArray(sent)     ? sent     : []).map(normalizeMsg);
    const receivedArr: any[] = (Array.isArray(received) ? received : []).map(normalizeMsg);

    const conversationMap = new Map<string, any>();

    // Messages ENVOYÉS → other_user = receiver
    sentArr.forEach((c: any) => {
      const otherId  = String(c.receiver_id ?? c.receiver?.id ?? '');
      if (!otherId) return;

      const existing = conversationMap.get(otherId);
      const isNewer  = !existing ||
        new Date(c.created_at) > new Date(existing.last_time ?? existing.created_at ?? 0);

      conversationMap.set(otherId, {
        ...(existing ?? {}),
        ...(isNewer ? { last_message: c.message, last_time: c.created_at } : {}),
        other_user: c.receiver ?? existing?.other_user,
        service:    c.service    ?? existing?.service,
        service_id: c.service_id ?? existing?.service_id,
        unread:     existing?.unread ?? 0,
      });
    });

    // Messages REÇUS → other_user = sender
    receivedArr.forEach((c: any) => {
      const otherId  = String(c.sender_id ?? c.sender?.id ?? '');
      if (!otherId) return;

      const existing = conversationMap.get(otherId);
      const isNewer  = !existing ||
        new Date(c.created_at) > new Date(existing.last_time ?? existing.created_at ?? 0);

      // Comptabiliser les non lus
      const addUnread = c.status === 'pending' ? 1 : 0;
      const unread    = (existing?.unread ?? 0) + addUnread;

      conversationMap.set(otherId, {
        ...(existing ?? {}),
        ...(isNewer ? { last_message: c.message, last_time: c.created_at } : {}),
        // Ne pas écraser other_user s'il était déjà défini via les sent
        other_user: existing?.other_user ?? c.sender,
        service:    existing?.service    ?? c.service,
        service_id: existing?.service_id ?? c.service_id,
        unread,
      });
    });

    // Trier par date décroissante
    return Array.from(conversationMap.values()).sort((a, b) =>
      new Date(b.last_time ?? b.created_at ?? 0).getTime() -
      new Date(a.last_time ?? a.created_at ?? 0).getTime()
    );
  },
};