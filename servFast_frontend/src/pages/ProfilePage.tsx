import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { servicesApi } from '../api/services';
import api from '../api/axiosConfig';
import type { Category, Service, User } from '../types/api';

const initialServiceForm = {
  title: '',
  description: '',
  price: '',
  city: '',
  category_id: '',
  photos: [] as File[],
};

// ─── Tab type ────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'my-services' | 'saved' | 'publish';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  User: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5.5" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 5.5V4a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0110.5 4v1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 9h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Bookmark: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2h8a1 1 0 011 1v10.5l-5-3-5 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 13V4M7 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 14.5v1A1.5 1.5 0 005 17h10a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Camera: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="9" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6.5 5l1-2h3l1 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Star: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <path d="M6.5 1l1.545 3.13L11.5 4.635l-2.5 2.435.59 3.43L6.5 8.885l-3.09 1.615L4 7.07 1.5 4.635l3.455-.505L6.5 1z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 1C4.015 1 2 3.015 2 5.5c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11 3.015 8.985 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon, dm }: { value: string | number; label: string; icon: string; dm: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-2 ${dm ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}
      style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
      <span className="text-xl">{icon}</span>
      <span className={`text-2xl font-extrabold ${dm ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Sora', sans-serif" }}>{value}</span>
      <span className={`text-xs font-medium ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, dm, onDelete }: { service: Service; dm: boolean; onDelete?: (id: string) => void }) {
  const categoryName = typeof service.category === 'string' ? service.category : service.category?.name ?? 'Service';
  const price = Number(service.price ?? 0);
  const rating = Number(service.average_rating ?? 0);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 ${dm ? 'border-gray-800 bg-gray-900 hover:border-red-700/50' : 'border-gray-100 bg-white hover:shadow-lg hover:shadow-red-50'}`}
      style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
      {/* Image */}
      {(service as any).image_url && (
        <img src={(service as any).image_url} alt={service.title} className="w-full h-36 object-cover" />
      )}
      {!(service as any).image_url && (
        <div className={`w-full h-36 flex items-center justify-center ${dm ? 'bg-gray-800' : 'bg-red-50'}`}>
          <span className="text-3xl opacity-30">🛠️</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{categoryName}</span>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <Icons.Star />
              <span className={`text-xs font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h3 className={`font-bold text-sm leading-snug mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
        {service.description && (
          <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>
        )}
        <div className={`flex items-center justify-between pt-3 border-t ${dm ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-1 text-gray-400">
            <Icons.MapPin />
            <span className="text-xs">{service.city ?? 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-red-600 text-sm">${price.toLocaleString()}</span>
            {onDelete && (
              <button onClick={() => onDelete(String(service.id))}
                className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer">
                <Icons.Trash />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { darkMode: dm } = useTheme();
  const user = authApi.getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<User | null>(null);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [savedServices, setSavedServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [metier, setMetier] = useState('');

  // Service form
  const [newService, setNewService] = useState(initialServiceForm);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileData, servicesData, savedData, categoriesData] = await Promise.all([
          usersApi.getProfile(),
          servicesApi.myServices(),
          servicesApi.getSaved(),
          api.get('/categories').then((res) => res.data),
        ]);

        const currentProfile = (profileData as any)?.user ?? profileData;
        setProfile(currentProfile);
        setFullName(currentProfile.full_name ?? currentProfile.fullName ?? '');
        setEmail(currentProfile.email ?? '');
        setPhone(currentProfile.phone ?? '');
        setCity(currentProfile.city ?? '');
        setBio((currentProfile as any).bio ?? '');
        setMetier((currentProfile as any).metier ?? (currentProfile as any).job_title ?? '');

        setMyServices((servicesData as any)?.data ?? servicesData ?? []);
        setSavedServices((savedData as any)?.data ?? savedData ?? []);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load profile page data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const refreshServices = async () => {
    try {
      const data = await servicesApi.myServices();
      setMyServices((data as any)?.data ?? data ?? []);
    } catch (error) {
      console.error('Failed to refresh services', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    try {
      const response = await usersApi.updateProfile({ full_name: fullName, email, phone, city, bio, metier });
      const updated = (response as any)?.user ?? response;
      setProfile(updated);
      setProfileMessage('Profil mis à jour avec succès ✓');
      setTimeout(() => setProfileMessage(null), 3000);
    } catch {
      setProfileError('Impossible de mettre à jour le profil. Réessayez.');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceMessage(null);
    setServiceError(null);
    if (!newService.title || !newService.description || !newService.price || !newService.category_id) {
      setServiceError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setPublishLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      formData.append('price', newService.price);
      formData.append('city', newService.city);
      formData.append('category_id', newService.category_id);
      newService.photos.forEach((photo, i) => formData.append(`photos[${i}]`, photo));

      await servicesApi.create(formData);
      setServiceMessage('Service publié avec succès ! ✓');
      setNewService(initialServiceForm);
      await refreshServices();
      setTimeout(() => { setServiceMessage(null); setActiveTab('my-services'); }, 2000);
    } catch {
      setServiceError('Impossible de créer le service. Vérifiez les champs et réessayez.');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await servicesApi.delete(id);
      setMyServices((prev) => prev.filter((s) => String(s.id) !== id));
    } catch {
      alert('Impossible de supprimer le service.');
    }
  };

  // ── color aliases ──────────────────────────────────────────────────────────
  const bg = dm ? 'bg-gray-950' : 'bg-gray-50';
  const card = dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = dm ? 'text-white' : 'text-gray-900';
  const sub = dm ? 'text-gray-400' : 'text-gray-500';
  const inputCls = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 ${dm ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`;

  const tabs: { id: Tab; label: string; Icon: () => React.ReactElement; count?: number }[] = [
    { id: 'profile', label: 'Mon profil', Icon: Icons.User },
    { id: 'my-services', label: 'Mes services', Icon: Icons.Briefcase, count: myServices.length },
    { id: 'saved', label: 'Enregistrés', Icon: Icons.Bookmark, count: savedServices.length },
    { id: 'publish', label: 'Publier un service', Icon: Icons.Plus },
  ];

  return (
    <div className={`${bg} min-h-screen transition-colors duration-300`} style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 1280 }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C0001B 0%, #8B0013 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-8 py-10 relative">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-extrabold overflow-hidden border-2 border-white/30"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                {profile?.avatarUrl
                  ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : (user?.firstName?.[0] ?? '?')}
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all cursor-pointer">
                <Icons.Camera />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                {profile ? (profile.fullName ?? profile.full_name ?? 'Mon profil') : 'Mon profil'}
              </h1>
              <p className="text-white/70 text-sm">
                {(profile as any)?.metier || (profile as any)?.job_title || 'Membre ServFast'}
                {profile?.city ? ` · ${profile.city}` : ''}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${user?.role === 'PROVIDER' ? 'bg-blue-500/30 text-blue-200 border border-blue-400/40' : 'bg-white/20 text-white/90 border border-white/20'}`}>
                  {user?.role ?? 'CLIENT'}
                </span>
                <span className="text-white/60 text-xs">{user?.email}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              {[
                { n: myServices.length, label: 'Services publiés' },
                { n: savedServices.length, label: 'Enregistrés' },
              ].map(({ n, label }) => (
                <div key={label} className="text-center bg-white/10 rounded-2xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{n}</div>
                  <div className="text-xs text-white/70 mt-1 whitespace-nowrap">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* ── Tab Nav ── */}
        <div className={`flex gap-1 p-1 rounded-2xl mb-8 ${dm ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}
          style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
          {tabs.map(({ id, label, Icon, count }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-red-700 text-white shadow-sm'
                  : dm ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              <Icon />
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  activeTab === id ? 'bg-white/25 text-white' : 'bg-red-700 text-white'
                }`}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: Profile ── */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Form */}
            <div className={`col-span-2 rounded-2xl border p-8 ${card}`} style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h2 className={`text-lg font-bold mb-1 ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>Informations personnelles</h2>
              <p className={`text-sm mb-6 ${sub}`}>Modifiez vos coordonnées et votre présentation.</p>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {profileMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                    <Icons.Check />{profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{profileError}</div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Nom complet</span>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="Votre nom complet" />
                  </label>
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="email@exemple.com" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Téléphone</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+216 XX XXX XXX" />
                  </label>
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Ville</span>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} placeholder="Tunis, Sfax..." />
                  </label>
                </div>

                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Métier / Spécialité</span>
                  <input value={metier} onChange={(e) => setMetier(e.target.value)} className={inputCls} placeholder="Ex: Développeur Web, Designer UI/UX..." />
                </label>

                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Bio</span>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={`${inputCls} resize-none`}
                    placeholder="Présentez votre expérience, vos compétences et ce qui vous distingue..." />
                </label>

                <button type="submit"
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer border-none"
                  style={{ boxShadow: '0 4px 14px rgba(192,0,27,0.3)' }}>
                  Enregistrer les modifications
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className={`rounded-2xl border p-6 ${card}`} style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${sub}`}>Résumé rapide</h3>
                {[
                  { label: 'Nom', value: profile?.fullName ?? profile?.full_name },
                  { label: 'Email', value: profile?.email },
                  { label: 'Ville', value: profile?.city },
                  { label: 'Téléphone', value: profile?.phone },
                ].map(({ label, value }) => (
                  <div key={label} className={`py-3 border-b last:border-0 ${dm ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className={`text-xs ${sub} mb-0.5`}>{label}</div>
                    <div className={`text-sm font-semibold ${text}`}>{value || '—'}</div>
                  </div>
                ))}
              </div>

              {(profile as any)?.bio && (
                <div className={`rounded-2xl border p-6 ${card}`} style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${sub}`}>Bio</h3>
                  <p className={`text-sm leading-relaxed ${text}`}>{(profile as any).bio}</p>
                </div>
              )}

              <button onClick={() => setActiveTab('publish')}
                className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer border-none"
                style={{ boxShadow: '0 4px 14px rgba(192,0,27,0.3)' }}>
                <Icons.Plus />
                Publier un nouveau service
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: My Services ── */}
        {activeTab === 'my-services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>Mes services publiés</h2>
                <p className={`text-sm mt-1 ${sub}`}>{myServices.length} service{myServices.length !== 1 ? 's' : ''} actif{myServices.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setActiveTab('publish')}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer border-none"
                style={{ boxShadow: '0 4px 14px rgba(192,0,27,0.25)' }}>
                <Icons.Plus />
                Publier un service
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
              </div>
            ) : myServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="text-5xl">🛠️</span>
                <p className={`text-lg font-semibold ${text}`}>Aucun service publié</p>
                <p className={`text-sm ${sub}`}>Commencez par partager votre premier service</p>
                <button onClick={() => setActiveTab('publish')}
                  className="mt-2 px-6 py-2.5 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 transition-all cursor-pointer border-none">
                  Publier un service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {myServices.map((s) => (
                  <ServiceCard key={s.id} service={s} dm={dm} onDelete={handleDeleteService} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Saved Services ── */}
        {activeTab === 'saved' && (
          <div>
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>Services enregistrés</h2>
              <p className={`text-sm mt-1 ${sub}`}>{savedServices.length} service{savedServices.length !== 1 ? 's' : ''} sauvegardé{savedServices.length !== 1 ? 's' : ''}</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
              </div>
            ) : savedServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="text-5xl">🔖</span>
                <p className={`text-lg font-semibold ${text}`}>Aucun service enregistré</p>
                <p className={`text-sm ${sub}`}>Explorez les services et sauvegardez vos favoris</p>
                <a href="/services"
                  className="mt-2 px-6 py-2.5 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 transition-all no-underline">
                  Explorer les services
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {savedServices.map((s) => (
                  <ServiceCard key={s.id} service={s} dm={dm} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Publish Service ── */}
        {activeTab === 'publish' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>Publier un service</h2>
              <p className={`text-sm mt-1 ${sub}`}>Renseignez les informations de votre service pour le proposer aux clients.</p>
            </div>

            <div className={`rounded-2xl border p-8 ${card}`} style={{ boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <form onSubmit={handleServiceSubmit} className="space-y-5">
                {serviceMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                    <Icons.Check />{serviceMessage}
                  </div>
                )}
                {serviceError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{serviceError}</div>
                )}

                {/* Title */}
                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>
                    Titre du service <span className="text-red-500">*</span>
                  </span>
                  <input value={newService.title}
                    onChange={(e) => setNewService((p) => ({ ...p, title: e.target.value }))}
                    className={inputCls} placeholder="Ex: Création de site web professionnel" />
                </label>

                {/* Description */}
                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>
                    Description <span className="text-red-500">*</span>
                  </span>
                  <textarea value={newService.description}
                    onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))}
                    rows={5} className={`${inputCls} resize-none`}
                    placeholder="Décrivez votre service en détail : ce que vous proposez, vos livrables, vos délais, votre méthodologie..." />
                </label>

                {/* Price + City */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>
                      Prix (USD) <span className="text-red-500">*</span>
                    </span>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm ${sub}`}>$</span>
                      <input type="number" min="0" value={newService.price}
                        onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))}
                        className={`${inputCls} pl-8`} placeholder="0" />
                    </div>
                  </label>
                  <label className="block">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Ville</span>
                    <input value={newService.city}
                      onChange={(e) => setNewService((p) => ({ ...p, city: e.target.value }))}
                      className={inputCls} placeholder="Tunis, Sfax, Sousse..." />
                  </label>
                </div>

                {/* Category */}
                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>
                    Catégorie <span className="text-red-500">*</span>
                  </span>
                  <select value={newService.category_id}
                    onChange={(e) => setNewService((p) => ({ ...p, category_id: e.target.value }))}
                    className={`${inputCls} cursor-pointer`}
                    style={{ background: dm ? undefined : 'white' }}>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </label>

                {/* Photos */}
                <label className="block">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${sub}`}>Photos du service</span>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      dm
                        ? 'border-gray-700 hover:border-red-700/50 bg-gray-800/50'
                        : 'border-gray-200 hover:border-red-400 bg-gray-50'
                    }`}
                    onClick={() => document.getElementById('service-photos')?.click()}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-gray-700' : 'bg-red-50'}`}>
                        <span className="text-red-600"><Icons.Upload /></span>
                      </div>
                      <p className={`text-sm font-semibold ${text}`}>
                        {newService.photos.length > 0
                          ? `${newService.photos.length} photo(s) sélectionnée(s)`
                          : 'Cliquez pour ajouter des photos'}
                      </p>
                      <p className={`text-xs ${sub}`}>PNG, JPG, WEBP — max 5 Mo par fichier</p>
                    </div>
                    <input id="service-photos" type="file" accept="image/*" multiple className="hidden"
                      onChange={(e) => {
                        if (!e.target.files) return;
                        setNewService((p) => ({ ...p, photos: Array.from(e.target.files!) }));
                      }} />
                  </div>
                  {newService.photos.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {newService.photos.map((f, i) => (
                        <div key={i} className={`text-xs px-3 py-1 rounded-lg font-medium ${dm ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                {/* Submit */}
                <div className="flex items-center gap-4 pt-2">
                  <button type="submit" disabled={publishLoading}
                    className="flex items-center gap-2 px-7 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer border-none"
                    style={{ boxShadow: '0 4px 14px rgba(192,0,27,0.3)' }}>
                    {publishLoading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : <Icons.Plus />}
                    {publishLoading ? 'Publication...' : 'Publier le service'}
                  </button>
                  <button type="button" onClick={() => setNewService(initialServiceForm)}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${dm ? 'border-gray-700 text-gray-400 bg-transparent hover:border-gray-600' : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'}`}>
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
