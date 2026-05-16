import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axiosConfig';

const STORAGE_URL = 'http://localhost:8000/storage/';
function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STORAGE_URL}${url}`;
}

const Icons = {
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 1C4.015 1 2 3.015 2 5.5c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11 3.015 8.985 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  Message: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Star: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <path d="M6.5 1l1.545 3.13L11.5 4.635l-2.5 2.435.59 3.43L6.5 8.885l-3.09 1.615L4 7.07 1.5 4.635l3.455-.505L6.5 1z"/>
    </svg>
  ),
};

function ServiceCard({ service, dm, onClick }: { service: any; dm: boolean; onClick: () => void }) {
  const photo = getImageUrl(service?.photos?.[0]?.photo_url ?? service?.image_url);
  const category = typeof service.category === 'string' ? service.category : service.category?.name ?? 'Service';
  const price = Number(service.price ?? 0);
  const rating = Number(service.ratings_avg_score ?? service.average_rating ?? 0);

  return (
    <button onClick={onClick}
      className={`text-left rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer w-full ${
        dm ? 'border-gray-800 bg-gray-900 hover:border-red-700/50' : 'border-gray-100 bg-white hover:shadow-lg'
      }`} style={{ background: 'none', boxShadow: dm ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}>
      {photo
        ? <img src={photo} alt={service.title} className="w-full h-36 object-cover" />
        : <div className={`w-full h-36 flex items-center justify-center ${dm ? 'bg-gray-800' : 'bg-red-50'}`}>
            <span className="text-4xl opacity-20">🛠️</span>
          </div>
      }
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{category}</span>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <Icons.Star />
              <span className={`text-xs font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h3 className={`font-bold text-sm leading-snug mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
        <div className={`flex items-center justify-between pt-3 border-t ${dm ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>
            <Icons.MapPin />
            <span className="text-xs">{service.city ?? '—'}</span>
          </div>
          <span className="font-extrabold text-red-600 text-sm">{price.toLocaleString('fr-TN')} DT</span>
        </div>
      </div>
    </button>
  );
}

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { darkMode: dm } = useTheme();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}/profile`)
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const bg   = dm ? 'bg-gray-950' : 'bg-gray-50';
  const card = dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = dm ? 'text-white' : 'text-gray-900';
  const sub  = dm ? 'text-gray-400' : 'text-gray-500';

  if (loading) return (
    <div className={`${bg} min-h-screen`}>
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
    </div>
  );

  if (!profile) return (
    <div className={`${bg} min-h-screen`}>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <span className="text-5xl">👤</span>
        <p className={`text-lg font-semibold ${text}`}>Profil introuvable</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 border-none cursor-pointer">
          Retour
        </button>
      </div>
    </div>
  );

  const services: any[] = profile.services ?? [];

  return (
    <div className={`${bg} min-h-screen`} style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 1280 }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C0001B 0%, #8B0013 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-8 py-10 relative">
          {/* Retour */}
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 cursor-pointer border-none bg-transparent">
            <Icons.ChevronLeft /> Retour
          </button>

          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-extrabold overflow-hidden border-2 border-white/30"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {profile.avatar_url || profile.avatar
                ? <img src={profile.avatar_url ?? getImageUrl(profile.avatar) ?? ''} alt={profile.full_name} className="w-full h-full object-cover" />
                : profile.full_name?.[0]?.toUpperCase()}
            </div>

            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                {profile.full_name}
              </h1>
              {profile.bio && (
                <p className="text-white/80 text-sm italic mt-1 mb-2 max-w-md leading-relaxed">"{profile.bio}"</p>
              )}
              <p className="text-white/70 text-sm">
                {profile.city ? `📍 ${profile.city}` : 'Membre ServFast'}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white/90 border border-white/20">
                  {profile.role?.toUpperCase() ?? 'MEMBRE'}
                </span>
              </div>
            </div>

            {/* Actions + Stats */}
            <div className="flex flex-col gap-3 items-end">
              {/* Bouton contacter → messagerie */}
              <button
                onClick={() => navigate(`/messages?userId=${profile.id}`)}
                className="flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer border-none"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                <Icons.Message /> Contacter
              </button>

              <div className="text-center bg-white/10 rounded-2xl px-6 py-3 border border-white/20">
                <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {services.length}
                </div>
                <div className="text-xs text-white/70 mt-1">Services publiés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">

        {/* Informations du compte */}
        <div className={`rounded-2xl border p-6 ${card}`}>
          <h2 className={`text-lg font-bold mb-4 ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>
            Informations
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Nom complet', value: profile.full_name },
              { label: 'Ville', value: profile.city },
              { label: 'Rôle', value: profile.role?.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${sub}`}>{label}</div>
                <div className={`text-sm font-semibold ${text}`}>{value || '—'}</div>
              </div>
            ))}
          </div>
          {profile.bio && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${sub}`}>Bio</div>
              <p className={`text-sm leading-relaxed ${text}`}>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Services publiés */}
        <div>
          <h2 className={`text-lg font-bold mb-4 ${text}`} style={{ fontFamily: "'Sora', sans-serif" }}>
            Services publiés ({services.length})
          </h2>
          {services.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${card}`}>
              <span className="text-4xl mb-3 block">🛠️</span>
              <p className={`font-semibold ${text}`}>Aucun service publié</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {services.map((s: any) => (
                <ServiceCard key={s.id} service={s} dm={dm} onClick={() => navigate(`/services/${s.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
