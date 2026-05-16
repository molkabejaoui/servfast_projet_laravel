import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { messagesApi } from '../api/messages';
import { authApi } from '../api/auth';

const STORAGE_URL = 'http://localhost:8000/storage/';
function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STORAGE_URL}${url}`;
}

const Icons = {
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13.5 1.5L6.5 8.5M13.5 1.5L9 13.5l-2.5-5-5-2.5 12-4.5z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 13c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CheckDouble: () => (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path d="M1 5.5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 5.5l2.5 2.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.5 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Image: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="5" cy="5" r="1" fill="currentColor"/>
      <path d="M1.5 10l3.5-3.5 2.5 2.5 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A4.5 4.5 0 003.5 6v3l-1 1.5h11L12.5 9V6A4.5 4.5 0 008 1.5z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  Empty: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
      <path d="M16 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="21" r="1.5" fill="currentColor"/>
      <circle cx="28" cy="21" r="1.5" fill="currentColor"/>
    </svg>
  ),
};

function Avatar({ user, size = 36 }: { user: any; size?: number }) {
  const imgUrl = getImageUrl(user?.avatar_url ?? user?.avatar);
  const initial = (user?.full_name ?? user?.name ?? '?')[0]?.toUpperCase();
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white font-bold"
        style={{ background: 'linear-gradient(135deg, #C0001B, #8B0013)', fontSize: size * 0.38 }}
      >
        {imgUrl
          ? <img src={imgUrl} alt={user?.full_name} className="w-full h-full object-cover" />
          : initial}
      </div>
    </div>
  );
}

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "À l'instant";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatMsgTime(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function MessagingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── currentUser : id toujours en string ──────────────────────────
  const currentUser    = useRef<any>(authApi.getCurrentUser()).current;
  const currentUserId  = String(currentUser?.id ?? '');

  const [conversations,  setConversations]  = useState<any[]>([]);
  const [activeUserId,   setActiveUserId]   = useState<string | null>(null);
  // Cache des messages par userId — clé = string
  const [messagesMap,    setMessagesMap]    = useState<Record<string, any[]>>({});
  const [input,          setInput]          = useState('');
  const [search,         setSearch]         = useState('');
  const [loadingConvs,   setLoadingConvs]   = useState(true);
  const [loadingMsgs,    setLoadingMsgs]    = useState(false);
  const [sending,        setSending]        = useState(false);
  const [notifCount,     setNotifCount]     = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // La conversation active
  const activeConv = conversations.find(
    c => String(c.other_user?.id) === String(activeUserId)
  );

  // Messages de la conversation active (jamais undefined)
  const messages: any[] = activeUserId ? (messagesMap[activeUserId] ?? []) : [];

  // ── 1. Charger les conversations + notifications ──────────────
  useEffect(() => {
    Promise.all([
      messagesApi.getAllConversations(),
      messagesApi.getNotifications(),
    ])
      .then(([convs, notifs]) => {
        setConversations(convs);
        setNotifCount(notifs.count ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, []);

  // ── 2. Polling léger des notifications (toutes les 15 s) ──────
  useEffect(() => {
    const id = setInterval(async () => {
      const notifs = await messagesApi.getNotifications();
      setNotifCount(notifs.count ?? 0);
      // Rafraîchir aussi l'aperçu des conversations (badge unread)
      if (notifs.count > 0) {
        messagesApi.getAllConversations()
          .then(convs => setConversations(convs))
          .catch(() => {});
      }
    }, 15_000);
    return () => clearInterval(id);
  }, []);

  // ── 3. Gérer ?userId= dans l'URL ─────────────────────────────
  useEffect(() => {
    const uid = searchParams.get('userId');
    if (!uid) return;

    setActiveUserId(uid);

    const alreadyExists = conversations.some(
      c => String(c.other_user?.id) === uid
    );
    if (alreadyExists) return;

    messagesApi.getUserProfile(uid).then(profile => {
      if (!profile) return;
      const otherUser = profile.user ?? profile;
      setConversations(prev => {
        const exists = prev.some(c => String(c.other_user?.id) === uid);
        if (exists) return prev;
        return [
          {
            other_user:   otherUser,
            last_message: '',
            last_time:    new Date().toISOString(),
            unread:       0,
            service:      null,
            service_id:   null,
          },
          ...prev,
        ];
      });
    });
  }, [searchParams, conversations.length]);

  // ── 4. Charger les messages de la conversation active ─────────
  useEffect(() => {
    if (!activeUserId) return;
    // Ne pas recharger si déjà en cache (le cache est vidé lors d'un handleSelectConv)
    if (messagesMap[activeUserId] !== undefined) return;

    setLoadingMsgs(true);
    messagesApi.getConversation(activeUserId)
      .then((arr: any[]) => {
        setMessagesMap(prev => ({ ...prev, [activeUserId]: arr }));
        // Remettre le badge unread à 0 dans la sidebar
        setConversations(prev =>
          prev.map(c =>
            String(c.other_user?.id) === activeUserId ? { ...c, unread: 0 } : c
          )
        );
      })
      .catch(() => {
        setMessagesMap(prev => ({ ...prev, [activeUserId]: [] }));
      })
      .finally(() => setLoadingMsgs(false));
  }, [activeUserId, messagesMap]);

  // ── 5. Scroll automatique vers le bas ─────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── 6. Envoi de message ───────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || !activeUserId || sending) return;

    setSending(true);
    const text = input.trim();
    setInput('');

    // ── Message optimiste ──────────────────────────────────────
    // sender_id = currentUserId (string) → isMe sera true
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id:          tempId,
      sender_id:   currentUserId,           // string
      receiver_id: String(activeUserId),    // string
      message:     text,
      status:      'pending',
      created_at:  new Date().toISOString(),
      sender:      currentUser,
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] ?? []), tempMsg],
    }));

    try {
      const serviceId = activeConv?.service_id ?? activeConv?.service?.id;

      // POST /conversations/{userId}/reply
      const res = await messagesApi.reply(activeUserId, {
        message: text,
        ...(serviceId ? { service_id: String(serviceId) } : {}),
      });

      // ── Le backend retourne { message, contact } ───────────
      // contact est déjà normalisé (sender_id en string) par messages.ts
      const savedContact = res?.contact ?? res?.data ?? res ?? {};

      const savedMsg: any = {
        // Étaler l'objet contact tel que retourné
        ...savedContact,
        // Forcer string pour la comparaison isMe
        sender_id:   String(savedContact.sender_id   ?? currentUserId),
        receiver_id: String(savedContact.receiver_id ?? activeUserId),
        // Garantir le champ message et sender
        message: savedContact.message ?? text,
        sender:  savedContact.sender  ?? currentUser,
        // Le statut vient du backend (pending par défaut)
        status:  savedContact.status  ?? 'pending',
      };

      // Remplacer le message temporaire par la version sauvegardée
      setMessagesMap(prev => ({
        ...prev,
        [activeUserId]: (prev[activeUserId] ?? []).map(m =>
          m.id === tempId ? savedMsg : m
        ),
      }));

      // Mettre à jour la sidebar
      setConversations(prev => {
        const exists = prev.some(c => String(c.other_user?.id) === String(activeUserId));
        if (exists) {
          return prev.map(c =>
            String(c.other_user?.id) === String(activeUserId)
              ? { ...c, last_message: text, last_time: new Date().toISOString() }
              : c
          );
        }
        return [
          {
            other_user:   activeConv?.other_user ?? null,
            last_message: text,
            last_time:    new Date().toISOString(),
            unread:       0,
            service:      activeConv?.service    ?? null,
            service_id:   activeConv?.service_id ?? null,
          },
          ...prev,
        ];
      });

    } catch (e) {
      console.error('Erreur envoi message:', e);
      // Rollback optimiste
      setMessagesMap(prev => ({
        ...prev,
        [activeUserId]: (prev[activeUserId] ?? []).filter(m => m.id !== tempId),
      }));
      setInput(text);
    } finally {
      setSending(false);
    }
  }, [input, activeUserId, sending, currentUserId, currentUser, activeConv]);

  // ── Sélectionner une conversation ────────────────────────────
  const handleSelectConv = (userId: string) => {
    if (userId === activeUserId) return;
    setActiveUserId(userId);
    setInput('');
    // Vider le cache pour recharger les messages frais
    setMessagesMap(prev => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  };

  const filteredConvs = conversations.filter(c =>
    (c.other_user?.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minWidth: 1280, fontFamily: "'DM Sans', sans-serif" }} className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>

        {/* ══════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════ */}
        <aside className="flex flex-col bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Messages
              </h2>
              {/* Badge notifications */}
              {notifCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  <Icons.Bell />
                  {notifCount} nouveau{notifCount > 1 ? 'x' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-red-300 transition-colors">
              <span className="text-gray-400"><Icons.Search /></span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                <Icons.Empty />
                <p className="text-sm">Aucune conversation</p>
                <p className="text-xs text-center px-6">Contactez un prestataire depuis une page service</p>
              </div>
            ) : (
              filteredConvs.map(conv => {
                const other    = conv.other_user ?? {};
                const isActive = String(other.id) === String(activeUserId);
                const lastMsg  = conv.last_message ?? conv.message ?? '';
                const time     = formatTime(conv.last_time ?? conv.created_at ?? '');
                const unread   = conv.unread ?? 0;

                return (
                  <button
                    key={other.id ?? Math.random()}
                    onClick={() => handleSelectConv(String(other.id))}
                    className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-all border-l-[3px] cursor-pointer ${
                      isActive ? 'bg-red-50 border-l-red-700' : 'border-l-transparent hover:bg-gray-50'
                    }`}
                  >
                    <Avatar user={other} size={38} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-xs font-semibold truncate ${isActive ? 'text-red-700' : 'text-gray-800'}`}>
                          {other.full_name ?? 'Utilisateur'}
                        </span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate leading-relaxed">{lastMsg || 'Nouvelle conversation'}</p>
                      {conv.service?.title && (
                        <p className="text-[10px] text-red-500 font-medium truncate mt-0.5">📦 {conv.service.title}</p>
                      )}
                    </div>
                    {unread > 0 && (
                      <span className="flex-shrink-0 bg-red-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center mt-1">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════
            ZONE CHAT
        ══════════════════════════════════════════════════════ */}
        {!activeUserId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">💬</div>
            <p className="text-base font-semibold text-gray-600">Sélectionnez une conversation</p>
            <p className="text-sm text-gray-400">ou contactez un prestataire depuis une page service</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white min-w-0">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white shadow-sm">
              {activeConv?.other_user ? (
                <div className="flex items-center gap-4">
                  <Avatar user={activeConv.other_user} size={44} />
                  <div>
                    <button
                      onClick={() => navigate(`/users/${activeConv.other_user.id}/profile`)}
                      className="font-bold text-sm text-gray-900 hover:text-red-700 transition-colors cursor-pointer bg-transparent border-none p-0 text-left leading-tight"
                    >
                      {activeConv.other_user.full_name}
                    </button>
                    {activeConv.service?.title && (
                      <div className="mt-1">
                        <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                          📦 {activeConv.service.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-3.5 bg-gray-100 rounded animate-pulse" />
                    <div className="w-20 h-2.5 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              )}

              {activeConv?.other_user && (
                <button
                  onClick={() => navigate(`/users/${activeConv.other_user.id}/profile`)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-300 px-3 py-2 rounded-xl transition-all cursor-pointer bg-transparent"
                >
                  <Icons.User /> Voir le profil <Icons.ChevronRight />
                </button>
              )}
            </div>

            {/* ── Liste des messages ── */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-1" style={{ background: '#fafafa' }}>
              {loadingMsgs ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-16">
                  <span className="text-4xl">👋</span>
                  <p className="text-sm font-medium">Début de la conversation</p>
                  <p className="text-xs">Envoyez un message pour commencer</p>
                </div>
              ) : (
                messages.map((msg: any, i: number) => {
                  // ══════════════════════════════════════════════
                  // isMe : les deux côtés sont des strings grâce à
                  // normalizeMsg() dans messages.ts et à currentUserId
                  // ══════════════════════════════════════════════
                  const isMe = String(msg.sender_id) === currentUserId;

                  const prevMsg        = i > 0 ? messages[i - 1] : null;
                  const nextMsg        = i < messages.length - 1 ? messages[i + 1] : null;
                  const isFirstInGroup = !prevMsg || String(prevMsg.sender_id) !== String(msg.sender_id);
                  const isLastInGroup  = !nextMsg  || String(nextMsg.sender_id)  !== String(msg.sender_id);
                  const otherUser      = activeConv?.other_user ?? msg.sender;
                  const time           = formatMsgTime(msg.created_at);
                  const marginTop      = isFirstInGroup && i > 0 ? 'mt-4' : 'mt-0.5';

                  return (
                    <div
                      key={msg.id ?? i}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${marginTop}`}
                    >
                      {/* Avatar de l'interlocuteur — uniquement dernier msg du groupe */}
                      {!isMe && (
                        <div className="w-7 flex-shrink-0 self-end mb-0.5">
                          {isLastInGroup
                            ? <Avatar user={otherUser} size={28} />
                            : <div className="w-7" />}
                        </div>
                      )}

                      <div className={`flex flex-col gap-0.5 max-w-sm ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Bulle */}
                        <div
                          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
                            isMe
                              ? `bg-red-700 text-white shadow-sm ${
                                  isFirstInGroup && isLastInGroup ? 'rounded-2xl' :
                                  isFirstInGroup                  ? 'rounded-2xl rounded-br-md' :
                                  isLastInGroup                   ? 'rounded-2xl rounded-tr-md' :
                                                                    'rounded-xl rounded-r-md'
                                }`
                              : `bg-white text-gray-800 border border-gray-100 shadow-sm ${
                                  isFirstInGroup && isLastInGroup ? 'rounded-2xl' :
                                  isFirstInGroup                  ? 'rounded-2xl rounded-bl-md' :
                                  isLastInGroup                   ? 'rounded-2xl rounded-tl-md' :
                                                                    'rounded-xl rounded-l-md'
                                }`
                          }`}
                        >
                          {msg.message}
                        </div>

                        {/* Heure + statut — dernier du groupe seulement */}
                        {isLastInGroup && (
                          <div className={`flex items-center gap-1 text-[10px] text-gray-400 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {time}
                            {isMe && (
                              <span className={msg.status === 'pending' ? 'text-gray-300' : 'text-emerald-500'}>
                                {msg.status === 'pending' ? <Icons.Check /> : <Icons.CheckDouble />}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Champ de saisie ── */}
            <div className="px-8 py-5 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-red-300 focus-within:bg-white transition-all">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Écrivez votre message..."
                    rows={1}
                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
                    style={{ maxHeight: 120 }}
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <button className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer">
                      <Icons.Image />
                    </button>
                    <span className="text-[10px] text-gray-400 select-none">Entrée pour envoyer · Maj+Entrée nouvelle ligne</span>
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-11 h-11 bg-red-700 text-white rounded-xl flex items-center justify-center hover:bg-red-800 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0 mb-0.5 border-none"
                >
                  {sending
                    ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <Icons.Send />}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
