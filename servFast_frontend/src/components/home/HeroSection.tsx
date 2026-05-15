import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { servicesApi } from "../../api/services";
import type { Service } from "../../types/api";

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Service[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (search.trim().length > 0) {
        setLoading(true);
        try {
          const data = await servicesApi.getAll({ search: search.trim() });
          setResults(data.slice(0, 8)); // Limit to 8 results
          setShowResults(true);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(delaySearch);
  }, [search]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/services?search=${encodeURIComponent(search)}`);
      setShowResults(false);
    } else {
      navigate('/services');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelectResult = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
    setShowResults(false);
    setSearch("");
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="grid grid-cols-2 gap-12 px-16 py-16 bg-gradient-to-br from-white via-white to-red-50 items-center">
      {/* Left */}
      <div>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-4">
          Find the perfect service
        </h1>
        <p className="text-base text-gray-500 leading-relaxed mb-7 max-w-md">
          Access a world of elite talent. From IT to legal, we connect you with
          professional experts who deliver results with speed and precision.
        </p>

        {/* Advanced Search */}
        <div ref={searchRef} className="relative max-w-lg">
          <div className="flex shadow-md rounded-xl overflow-hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3.5 border border-r-0 border-gray-200 text-sm outline-none focus:border-red-700 rounded-l-xl"
            />
            <button
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3.5 font-bold text-sm transition-colors rounded-r-xl border-none cursor-pointer"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && (results.length > 0 || loading) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">Searching...</div>
              ) : results.length > 0 ? (
                <>
                  {results.map((service) => {
                    const categoryName = typeof service.category === "string" ? service.category : service.category?.name ?? "Service";
                    const providerName = service.user?.full_name ?? "Provider";
                    const rating = Number(service.average_rating ?? 0);

                    return (
                      <button
                        key={service.id}
                        onClick={() => handleSelectResult(service.id)}
                        className="w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={service.image_url || "/images/service-placeholder.jpg"}
                            alt={service.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-semibold text-sm text-gray-900 truncate">{service.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {categoryName} • {providerName}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-amber-400 text-xs">★</span>
                                <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-red-700 mt-1">${Number(service.price ?? 0).toLocaleString()}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {results.length > 0 && (
                    <div className="px-4 py-2 text-center text-sm text-gray-500 border-t bg-gray-50">
                      <button
                        onClick={handleSearch}
                        className="text-red-700 font-semibold hover:text-red-800 bg-transparent border-none cursor-pointer"
                      >
                        View all results →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">No services found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-sm text-gray-400">Popular:</span>
          {["Informatique", "Plomberie", "Cours particuliers"].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/services?search=${encodeURIComponent(tag)}`)}
              className="text-xs text-red-700 border border-red-200 rounded-full px-3 py-0.5 no-underline hover:bg-red-50 transition-colors bg-transparent cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80"
          alt="Hero"
          className="w-full rounded-2xl max-h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-white rounded-2xl p-4 shadow-xl max-w-xs text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-red-700 text-xs">ServFast Assistant</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-2">
            Bonjour ! Comment puis-je vous aider à trouver le service parfait ?
          </p>
          <div className="bg-red-700 text-white rounded-xl px-3 py-2 text-xs mb-2">
            Je cherche un développeur...
          </div>
          <div className="text-gray-300 text-xs">● ● ● en train de taper</div>
        </div>
      </div>
    </section>
  );
}
