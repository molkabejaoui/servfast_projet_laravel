import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/home/HeroSection";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProfessionals from "../components/home/FeaturedProfessionals";
import HowItWorks from "../components/home/HowItWorks";
import TestimonialBanner from "../components/home/TestimonialBanner";
import { servicesApi } from "../api/services";

const STORAGE_URL = 'http://localhost:8000/storage/';
function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STORAGE_URL}${url}`;
}

function FeaturedServiceCard({ service, onClick }: { service: any; onClick: () => void }) {
  const photo = getImageUrl(service?.photos?.[0]?.photo_url ?? service?.image_url);
  const category = typeof service.category === 'string' ? service.category : service.category?.name ?? 'Service';
  const price = Number(service.price ?? 0);
  const rating = Number(service.average_rating ?? 0);
  const provider = service.user;

  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer w-full"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)', background: 'none' }}
    >
      {/* Photo */}
      <div className="relative">
        {photo ? (
          <img src={photo} alt={service.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-red-50 flex items-center justify-center">
            <span className="text-5xl opacity-20">🛠️</span>
          </div>
        )}
        <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-red-700 text-white uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-900 leading-snug mb-2 line-clamp-2">{service.title}</h3>

        {/* Provider */}
        {provider && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-red-100 flex items-center justify-center text-xs font-bold text-red-700 flex-shrink-0">
              {provider.avatar_url
                ? <img src={provider.avatar_url} alt={provider.full_name} className="w-full h-full object-cover" />
                : (provider.full_name?.[0]?.toUpperCase() ?? '?')}
            </div>
            <span className="text-xs text-gray-500 truncate">{provider.full_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {rating > 0 && (
              <>
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              </>
            )}
          </div>
          <span className="font-extrabold text-red-600 text-sm">{price.toLocaleString('fr-TN')} DT</span>
        </div>
      </div>
    </button>
  );
}

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    servicesApi.getAll()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setFeaturedServices(arr.slice(0, 6)); // 6 premiers
      })
      .catch(() => setFeaturedServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", minWidth: 1280 }}>
      <Navbar />
      <HeroSection />
      <CategoryGrid />

      {/* ── Featured Services ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">À la une</p>
            <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
              Services populaires
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all cursor-pointer bg-transparent"
          >
            Voir tous les services →
          </button>
        </div>

        {loadingServices ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🛠️</span>
            <p className="text-gray-500 text-sm">Aucun service disponible pour le moment</p>
            <button onClick={() => navigate('/services')}
              className="px-5 py-2 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 border-none cursor-pointer">
              Explorer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {featuredServices.map((s) => (
              <FeaturedServiceCard
                key={s.id}
                service={s}
                onClick={() => navigate(`/services/${s.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <FeaturedProfessionals />
      <HowItWorks />
      <TestimonialBanner />
      <Footer />

      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed", bottom: 28, right: 28,
          background: "#C0001B", color: "#fff",
          border: "none", borderRadius: "50%",
          width: 54, height: 54, fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(192,0,27,0.4)",
          zIndex: 200,
        }}
      >💬</button>
    </div>
  );
}