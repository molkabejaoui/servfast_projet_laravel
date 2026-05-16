import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useTheme } from '../context/ThemeContext';
import { servicesApi } from '../api/services';
import { ratingsApi } from '../api/ratings';
import { messagesApi } from '../api/messages';
import { authApi } from '../api/auth';
import api from '../api/axiosConfig';

const STORAGE_URL = 'http://localhost:8000/storage/';

function getImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STORAGE_URL}${url}`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
    Star: ({ filled }: { filled?: boolean }) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'}>
            <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.128L8 10.5l-3.708 2.079L5 8.451 2 5.528l4.146-.772L8 1z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
    ),
    MapPin: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 1C4.515 1 2.5 3.015 2.5 5.5c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11.5 3.015 9.485 1 7 1z" stroke="currentColor" strokeWidth="1.3" />
        </svg>
    ),
    ChevronLeft: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    ChevronRight: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Message: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    User: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    ),
    Bookmark: ({ filled }: { filled?: boolean }) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'}>
            <path d="M4 2h8a1 1 0 011 1v10.5l-5-3-5 3V3a1 1 0 011-1z"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Check: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Send: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12.5 1.5L5.5 8.5M12.5 1.5L8 12.5l-2.5-4-4-2.5 11-4.5z"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    X: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
};

// ─── Star Rating Input ─────────────────────────────────────────────────────────
function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className={`transition-all cursor-pointer border-none bg-transparent p-0.5 text-xl ${(hovered || value) >= star ? 'text-amber-400' : 'text-gray-300'
                        }`}>★</button>
            ))}
        </div>
    );
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: size }}
                    className={star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
            ))}
        </div>
    );
}

// ─── Contact Modal ─────────────────────────────────────────────────────────────
function ContactModal({ serviceId, providerId, providerName, dm, onClose }: {
    serviceId: string; providerId: string; providerName: string; dm: boolean; onClose: () => void;
}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const inputCls = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-red-500 ${dm ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`;

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true); setError('');
        try {
            await messagesApi.sendMessage(serviceId, { message, phone });
            setSent(true);
        } catch {
            setError("Impossible d'envoyer le message.");
        } finally { setLoading(false); }
    };

    const goToMessages = () => {
        navigate(`/messages?userId=${providerId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl border p-7 shadow-2xl ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-bold text-base ${dm ? 'text-white' : 'text-gray-900'}`}>
                        Contacter {providerName}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 cursor-pointer bg-transparent border-none">
                        <Icons.X />
                    </button>
                </div>

                {sent ? (
                    <div className="flex flex-col items-center py-8 gap-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">✓</div>
                        <p className={`font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>Message envoyé !</p>
                        <p className={`text-sm text-center ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                            {providerName} vous répondra bientôt.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <button onClick={goToMessages}
                                className="px-5 py-2.5 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 border-none cursor-pointer flex items-center gap-2">
                                <Icons.Message /> Voir la conversation
                            </button>
                            <button onClick={onClose}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer bg-transparent ${dm ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                                Fermer
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                                Votre message *
                            </label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                                rows={4} className={`${inputCls} resize-none`} placeholder="Décrivez votre besoin..." />
                        </div>
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                                Téléphone (optionnel)
                            </label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+216 XX XXX XXX" />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button onClick={handleSend} disabled={loading || !message.trim()}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm cursor-pointer border-none">
                                {loading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Icons.Send />}
                                {loading ? 'Envoi...' : 'Envoyer'}
                            </button>
                            <button onClick={onClose}
                                className={`px-5 py-3 rounded-xl text-sm font-semibold border cursor-pointer bg-transparent ${dm ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { darkMode: dm } = useTheme();
    const currentUser = authApi.getCurrentUser();

    const [service, setService] = useState<any>(null);
    const [ratings, setRatings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [showContact, setShowContact] = useState(false);

    // Rating form
    const [userScore, setUserScore] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingError, setRatingError] = useState('');
    const [ratingSuccess, setRatingSuccess] = useState(false);
    const [alreadyRated, setAlreadyRated] = useState(false);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);
            try {
                const [svcRes, ratRes] = await Promise.all([
                    servicesApi.getById(id),
                    ratingsApi.getServiceRatings(id),
                ]);

                const svc = svcRes?.data ?? svcRes;
                setService(svc);

                // Ratings peuvent venir sous différentes formes
                const ratObj = ratRes;
                const ratArr = ratObj?.ratings ?? ratObj?.data ?? ratObj ?? [];
                setRatings(Array.isArray(ratArr) ? ratArr : []);

                // Vérifier si déjà noté par l'utilisateur courant
                if (currentUser) {
                    const userId = (currentUser as any)?.id;
                    const alreadyRatedByMe = (Array.isArray(ratArr) ? ratArr : [])
                        .some((r: any) => (r.reviewer_id ?? r.reviewer?.id) === userId);
                    setAlreadyRated(alreadyRatedByMe);

                    // Vérifier si déjà sauvegardé
                    try {
                        const savedRes = await api.get(`/services/${id}/is-saved`);
                        setSaved(savedRes.data?.saved ?? false);
                    } catch { /* non connecté ou route absente */ }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // ── Soumettre un rating ───────────────────────────────────────
    const handleRatingSubmit = async () => {
        if (!userScore || alreadyRated) return;
        setRatingLoading(true); setRatingError('');
        try {
            const res = await ratingsApi.submit(id!, { score: userScore, comment: userComment });
            const newRating = res?.rating ?? res?.data ?? res;

            const updatedRatings = [newRating, ...ratings];
            setRatings(updatedRatings);

            // Recalculer moyenne localement
            const avg = updatedRatings.reduce((sum: number, r: any) => sum + Number(r.score ?? 0), 0) / updatedRatings.length;
            setService((prev: any) => ({ ...prev, average_rating: avg, total_ratings: updatedRatings.length }));

            setUserScore(0); setUserComment('');
            setAlreadyRated(true);
            setRatingSuccess(true);
            setTimeout(() => setRatingSuccess(false), 3000);
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? 'Impossible de soumettre votre avis.';
            setRatingError(msg);
        } finally { setRatingLoading(false); }
    };

    // ── Enregistrer / Désarchiver ──────────────────────────────────
    const handleToggleSave = async () => {
        if (!currentUser) { navigate('/login'); return; }
        setSaveLoading(true);
        try {
            if (saved) {
                await api.delete(`/services/${id}/unsave`);
                setSaved(false);
            } else {
                await api.post(`/services/${id}/save`);
                setSaved(true);
            }
        } catch { /* silencieux */ }
        finally { setSaveLoading(false); }
    };

    // ── Helpers ───────────────────────────────────────────────────
    const photos: string[] = (service?.photos ?? [])
        .map((p: any) => getImageUrl(p?.photo_url ?? p?.url ?? p))
        .filter(Boolean);

    const mainPhoto = photos[photoIndex] ?? getImageUrl(service?.image_url) ?? null;
    const provider = service?.user ?? null;
    const category = typeof service?.category === 'string' ? service.category : service?.category?.name ?? 'Service';
    const price = Number(service?.price ?? 0);
    const avgRating = Number(service?.average_rating ?? 0);
    const ratingCount = ratings.length;

    const bg = dm ? 'bg-gray-950' : 'bg-gray-50';
    const card = dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const text = dm ? 'text-white' : 'text-gray-900';
    const sub = dm ? 'text-gray-400' : 'text-gray-500';
    const inputCls = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-red-500 ${dm ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`;

    if (loading) return (
        <div className={`${bg} min-h-screen`}>
            <Navbar />
            <div className="flex items-center justify-center h-96">
                <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
            </div>
        </div>
    );

    if (!service) return (
        <div className={`${bg} min-h-screen`}>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <span className="text-5xl">🔍</span>
                <p className={`text-lg font-semibold ${text}`}>Service introuvable</p>
                <button onClick={() => navigate('/services')}
                    className="px-6 py-2.5 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 border-none cursor-pointer">
                    Retour aux services
                </button>
            </div>
        </div>
    );

    return (
        <div className={`${bg} min-h-screen`} style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 1280 }}>
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <Navbar />

            {showContact && provider && (
                <ContactModal
                    serviceId={id!}
                    providerId={String(provider.id)}
                    providerName={provider.full_name ?? 'le prestataire'}
                    dm={dm}
                    onClose={() => setShowContact(false)}
                />
            )}

            <div className="max-w-6xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <button onClick={() => navigate('/services')}
                    className={`flex items-center gap-2 text-sm font-medium mb-6 cursor-pointer border-none bg-transparent ${sub} hover:text-red-600 transition-colors`}>
                    <Icons.ChevronLeft /> Retour aux services
                </button>

                <div className="grid grid-cols-3 gap-8">

                    {/* ── LEFT COL ── */}
                    <div className="col-span-2 space-y-6">

                        {/* Photos */}
                        <div className={`rounded-2xl border overflow-hidden ${card}`}>
                            <div className="relative">
                                {mainPhoto
                                    ? <img src={mainPhoto} alt={service.title} className="w-full object-cover" style={{ height: 420 }} />
                                    : <div className={`w-full flex items-center justify-center ${dm ? 'bg-gray-800' : 'bg-red-50'}`} style={{ height: 420 }}>
                                        <span className="text-6xl opacity-20">🛠️</span>
                                    </div>
                                }
                                {photos.length > 1 && (
                                    <>
                                        <button onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer border-none">
                                            <Icons.ChevronLeft />
                                        </button>
                                        <button onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer border-none">
                                            <Icons.ChevronRight />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {photos.map((_, i) => (
                                                <button key={i} onClick={() => setPhotoIndex(i)}
                                                    className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all ${i === photoIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-700 text-white uppercase tracking-wide">{category}</span>
                                </div>
                            </div>
                            {photos.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {photos.map((photo, i) => (
                                        <button key={i} onClick={() => setPhotoIndex(i)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 cursor-pointer ${i === photoIndex ? 'border-red-600' : dm ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Titre + Infos */}
                        <div className={`rounded-2xl border p-6 ${card}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className={`text-2xl font-extrabold mb-3 leading-tight ${text}`}
                                        style={{ fontFamily: "'Sora', sans-serif" }}>{service.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        {avgRating > 0 && (
                                            <div className="flex items-center gap-2">
                                                <StarDisplay rating={avgRating} />
                                                <span className={`text-sm font-bold ${text}`}>{avgRating.toFixed(1)}</span>
                                                <span className={`text-sm ${sub}`}>({ratingCount} avis)</span>
                                            </div>
                                        )}
                                        {service.city && (
                                            <div className={`flex items-center gap-1.5 ${sub}`}>
                                                <Icons.MapPin /><span className="text-sm">{service.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className={`text-xs uppercase tracking-wider mb-1 ${sub}`}>Prix</div>
                                    <div className="text-3xl font-extrabold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                                        {price.toLocaleString('fr-TN')} <span className="text-lg">DT</span>
                                    </div>
                                </div>
                            </div>
                            {service.description && (
                                <div>
                                    <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${sub}`}>Description</h2>
                                    <p className={`text-sm leading-relaxed ${text}`}>{service.description}</p>
                                </div>
                            )}
                        </div>

                        {/* ── Avis & Commentaires ── */}
                        <div className={`rounded-2xl border p-6 ${card}`}>
                            <h2 className={`text-lg font-bold mb-5 ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>
                                Avis des utilisateurs
                            </h2>

                            {/* Résumé graphique */}
                            {avgRating > 0 && (
                                <div className={`flex items-center gap-6 p-4 rounded-xl mb-6 ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <div className="text-center min-w-[80px]">
                                        <div className="text-5xl font-extrabold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                                            {avgRating.toFixed(1)}
                                        </div>
                                        <StarDisplay rating={avgRating} size={18} />
                                        <div className={`text-xs mt-1 ${sub}`}>{ratingCount} avis</div>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = ratings.filter((r: any) => Math.round(Number(r.score ?? 0)) === star).length;
                                            const pct = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2">
                                                    <span className={`text-xs w-2 ${sub}`}>{star}</span>
                                                    <span className="text-amber-400 text-xs">★</span>
                                                    <div className={`flex-1 h-1.5 rounded-full ${dm ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className={`text-xs w-5 text-right ${sub}`}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Formulaire avis */}
                            {currentUser && !alreadyRated && (
                                <div className={`rounded-xl border p-5 mb-6 ${dm ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                                    <h3 className={`text-sm font-bold mb-4 ${text}`}>Donner votre avis</h3>
                                    <div className="mb-3">
                                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Note *</label>
                                        <StarRatingInput value={userScore} onChange={setUserScore} />
                                    </div>
                                    <div className="mb-4">
                                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Commentaire (optionnel)</label>
                                        <textarea value={userComment} onChange={(e) => setUserComment(e.target.value)}
                                            rows={3} className={`${inputCls} resize-none`} placeholder="Partagez votre expérience..." />
                                    </div>
                                    {ratingError && <p className="text-sm text-red-600 mb-3">{ratingError}</p>}
                                    {ratingSuccess && (
                                        <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                                            <Icons.Check /> Avis soumis avec succès !
                                        </div>
                                    )}
                                    <button onClick={handleRatingSubmit} disabled={!userScore || ratingLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm cursor-pointer border-none">
                                        {ratingLoading
                                            ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            : <Icons.Send />}
                                        {ratingLoading ? 'Envoi...' : "Soumettre l'avis"}
                                    </button>
                                </div>
                            )}

                            {/* Message déjà noté */}
                            {currentUser && alreadyRated && (
                                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${dm ? 'bg-gray-800 text-gray-300' : 'bg-emerald-50 text-emerald-700'} text-sm font-medium`}>
                                    <Icons.Check /> Vous avez déjà noté ce service
                                </div>
                            )}

                            {/* Liste des avis */}
                            {ratings.length === 0 ? (
                                <div className={`text-center py-10 ${sub}`}>
                                    <span className="text-3xl block mb-2">💬</span>
                                    <p className="text-sm">Aucun avis pour ce service</p>
                                    <p className="text-xs mt-1">Soyez le premier à laisser un commentaire</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ratings.map((r: any, i: number) => {
                                        const score = Number(r.score ?? 0);
                                        const reviewer = r.reviewer ?? r.user ?? {};
                                        const name = reviewer.full_name ?? reviewer.name ?? 'Utilisateur';
                                        const date = r.created_at
                                            ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '';

                                        return (
                                            <div key={r.id ?? i} className={`flex gap-4 pb-4 ${i < ratings.length - 1 ? `border-b ${dm ? 'border-gray-800' : 'border-gray-100'}` : ''}`}>
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden"
                                                    style={{ background: 'linear-gradient(135deg, #C0001B, #8B0013)', color: 'white' }}>
                                                    {reviewer.avatar
                                                        ? <img src={getImageUrl(reviewer.avatar) ?? ''} alt={name} className="w-full h-full object-cover" />
                                                        : name[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-bold ${text}`}>{name}</span>
                                                            {date && <span className={`text-xs ${sub}`}>{date}</span>}
                                                        </div>
                                                        <StarDisplay rating={score} size={13} />
                                                    </div>
                                                    {r.comment && <p className={`text-sm leading-relaxed ${sub}`}>{r.comment}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT COL ── */}
                    <div className="space-y-5">

                        {/* Carte actions */}
                        <div className={`rounded-2xl border p-6 sticky top-24 space-y-4 ${card}`}
                            style={{ boxShadow: dm ? 'none' : '0 4px 24px rgba(0,0,0,0.06)' }}>
                            <div className="flex items-baseline justify-between">
                                <span className={`text-sm ${sub}`}>Prix</span>
                                <span className="text-2xl font-extrabold text-red-600" style={{ fontFamily: "'Sora', sans-serif" }}>
                                    {price.toLocaleString('fr-TN')} DT
                                </span>
                            </div>

                            <button onClick={() => { if (!currentUser) { navigate('/login'); return; } navigate(`/messages?userId=${provider?.id}`); }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-sm cursor-pointer border-none"
                                style={{ boxShadow: '0 4px 14px rgba(192,0,27,0.3)' }}>
                                <Icons.Message /> Contacter le prestataire
                            </button>

                            <button onClick={handleToggleSave} disabled={saveLoading}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer disabled:opacity-50 ${saved
                                    ? 'bg-red-50 border-red-300 text-red-700'
                                    : dm ? 'border-gray-700 text-gray-400 hover:border-gray-600 bg-transparent'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-transparent'}`}>
                                {saveLoading
                                    ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                    : <Icons.Bookmark filled={saved} />}
                                {saved ? 'Enregistré ✓' : 'Enregistrer'}
                            </button>

                            {avgRating > 0 && (
                                <div className={`flex items-center justify-center gap-2 pt-1 ${sub}`}>
                                    <StarDisplay rating={avgRating} size={12} />
                                    <span className="text-xs">{avgRating.toFixed(1)} · {ratingCount} avis</span>
                                </div>
                            )}
                        </div>

                        {/* Carte prestataire */}
                        {provider && (
                            <div className={`rounded-2xl border p-6 ${card}`}>
                                <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${sub}`}>Prestataire</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-xl font-extrabold"
                                        style={{ background: 'linear-gradient(135deg, #C0001B, #8B0013)' }}>
                                        {provider.avatar_url || provider.avatar
                                            ? <img src={provider.avatar_url ?? getImageUrl(provider.avatar) ?? ''} alt={provider.full_name} className="w-full h-full object-cover" />
                                            : provider.full_name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${text}`}>{provider.full_name}</div>
                                        {provider.city && (
                                            <div className={`flex items-center gap-1 text-xs mt-0.5 ${sub}`}>
                                                <Icons.MapPin />{provider.city}
                                            </div>
                                        )}
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${dm ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                            {provider.role?.toUpperCase() ?? 'PRESTATAIRE'}
                                        </span>
                                    </div>
                                </div>
                                {provider.bio && (
                                    <p className={`text-xs leading-relaxed mb-4 italic ${sub}`}>"{provider.bio}"</p>
                                )}
                                <div className="space-y-2">
                                    <button onClick={() => navigate(`/users/${provider.id}/profile`)}
                                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer bg-transparent transition-all ${dm ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                                                : 'border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-700'}`}>
                                        <Icons.User /> Voir le profil <Icons.ChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
