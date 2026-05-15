import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { servicesApi } from "../../api/services";
import type { Service } from "../../types/api";

export default function FeaturedProfessionals() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll({});
        // Get top rated services (sort by average_rating)
        const topRated = (data as Service[])
          .filter((s: Service) => s.average_rating && s.average_rating > 0)
          .sort((a: Service, b: Service) => (b.average_rating ?? 0) - (a.average_rating ?? 0))
          .slice(0, 4);
        
        setServices(topRated);
      } catch (error) {
        console.error("Failed to load featured services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="px-16 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white animate-pulse">
              <div className="w-full h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-16 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
        <button
          onClick={() => navigate('/services')}
          className="text-sm font-semibold text-red-700 no-underline hover:opacity-75 bg-transparent border-none cursor-pointer"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {services.map((service) => {
          const categoryName = typeof service.category === "string" ? service.category : service.category?.name ?? "Service";
          const providerName = service.user?.full_name ?? "Provider";
          const rating = Number(service.average_rating ?? 0);
          const imageUrl = service.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80";

          return (
            <button
              key={service.id}
              onClick={() => navigate(`/services/${service.id}`)}
              className="border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-red-100 hover:-translate-y-1 bg-white text-left"
            >
              <div className="relative">
                <img src={imageUrl} alt={service.title} className="w-full h-40 object-cover" />
                {rating >= 4.8 && (
                  <span className="absolute top-2.5 left-2.5 bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    TOP RATED
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-400 mb-1">{providerName}</div>
                <div className="font-bold text-sm text-gray-900 leading-snug mb-2 min-h-10 line-clamp-2">
                  {service.title}
                </div>
                <div className="text-xs text-gray-500 mb-2">{categoryName}</div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({service.total_ratings || 0} reviews)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">From</span>
                  <span className="font-extrabold text-red-700 text-sm">${Number(service.price ?? 0).toLocaleString()}/hr</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}