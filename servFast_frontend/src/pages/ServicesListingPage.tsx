import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/ThemeContext";
import { servicesApi } from "../api/services";
import api from "../api/axiosConfig";
import type { Service, Category } from "../types/api";

const ITEMS_PER_PAGE = 6;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export default function ServicesListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { darkMode: dm } = useTheme();

  // ── Read URL parameters ──────────────────────────────────────────────────
  const urlCategoryId = searchParams.get("category_id");
  const urlType = searchParams.get("type"); // 'Solutions' or 'Enterprise'

  // ── State ────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return urlCategoryId ? [urlCategoryId] : [];
  });
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories once
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Sync when URL category_id changes
  useEffect(() => {
    setSelectedCategories(urlCategoryId ? [urlCategoryId] : []);
  }, [urlCategoryId]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await servicesApi.getAll({
          search: searchParams.get("search") || undefined,
        });
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  const toggleCategory = (catId: string) =>
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );

  // ── Actual filtering logic ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return services.filter((s) => {
      const categoryId = (s.category as any)?.id?.toString() ?? "";
      const categoryName = typeof s.category === "string" ? s.category : s.category?.name ?? "";
      const categoryType = categories.find(c => c.id.toString() === categoryId)?.type || "";
      const rating = Number(s.average_rating ?? (s as any).rating ?? 0);
      const price = Number(s.price ?? 0);
      const providerName = s.user?.full_name ?? "";

      // Filter by type (Solutions/Enterprise)
      const matchesType = !urlType || categoryType === urlType;
      
      // Filter by specific category if category_id is set
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(categoryId);
      const matchesPrice = price <= maxPrice;
      const matchesRating = rating >= minRating;
      const matchesSearch =
        search === "" ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        categoryName.toLowerCase().includes(search.toLowerCase()) ||
        providerName.toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  }, [services, selectedCategories, maxPrice, minRating, search, urlType, categories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [selectedCategories, maxPrice, minRating, search, services, urlType]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(10000);
    setMinRating(0);
    setSearch("");
  };

  // Determine page title
  let pageTitle = "All Services";
  if (urlCategoryId) {
    const selectedCat = categories.find(c => c.id.toString() === urlCategoryId);
    pageTitle = selectedCat?.name || "Services";
  } else if (urlType === "Solutions") {
    pageTitle = "Solutions";
  } else if (urlType === "Enterprise") {
    pageTitle = "Enterprise Services";
  }

  // Get visible categories (those matching the current type filter)
  const visibleCategories = categories.filter(c => !urlType || c.type === urlType);

  // ─── color helpers ──────────────────────────────────────────────────────
  const bg = dm ? "bg-gray-900" : "bg-white";
  const text = dm ? "text-white" : "text-gray-900";
  const subtext = dm ? "text-gray-400" : "text-gray-500";
  const border = dm ? "border-gray-700" : "border-gray-100";
  const inputBg = dm ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-300";
  const cardBg = dm ? "bg-gray-800 border-gray-700 hover:border-red-700" : "bg-white border-gray-100 hover:shadow-red-100";

  return (
    <div className={`min-w-[1280px] transition-colors duration-300 ${bg}`}>
      <Navbar />
      <div className={`flex min-h-screen ${bg}`}>

        {/* ── Sidebar ── */}
        <aside className={`w-64 min-w-64 px-6 py-8 border-r ${border} sticky top-16 h-[calc(100vh-64px)] overflow-y-auto`}>
          <h2 className={`text-lg font-bold ${text} mb-1`}>Filters</h2>
          <p className={`text-xs ${subtext} mb-6`}>Refine your search</p>

          {/* Search */}
          <div className="mb-6">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${text}`}>Search</div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-red-600 transition-colors ${inputBg}`}
            />
          </div>

          {/* Categories */}
          {visibleCategories.length > 0 && (
            <div className="mb-5">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${text}`}>Categories</div>
              {visibleCategories.map((cat) => (
                <label key={cat.id} className={`flex items-center gap-2 mb-2 cursor-pointer text-sm ${selectedCategories.includes(cat.id.toString()) ? "text-red-600 font-semibold" : subtext}`}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id.toString())}
                    onChange={() => toggleCategory(cat.id.toString())}
                    className="accent-red-600 w-4 h-4 cursor-pointer"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}

          {/* Price Range */}
          <div className="mb-6">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${text}`}>Max Price</div>
            <input
              type="range" min={0} max={10000} step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer mb-2"
            />
            <div className={`flex justify-between text-xs ${subtext}`}>
              <span>$0</span>
              <span className="font-semibold text-red-600">${maxPrice.toLocaleString()}{maxPrice === 10000 ? "+" : ""}</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="mb-6">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${text}`}>Minimum Rating</div>
            {[4.5, 4, 3].map((r) => (
              <label key={r} className={`flex items-center gap-2 mb-2 cursor-pointer text-sm ${minRating === r ? "text-red-600 font-semibold" : subtext}`}>
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-red-600 cursor-pointer"
                />
                <span className="text-amber-400">{"★".repeat(Math.floor(r))}</span>
                <span className={`text-xs ${subtext}`}>{r}+ stars</span>
              </label>
            ))}
            {minRating > 0 && (
              <button onClick={() => setMinRating(0)} className={`text-xs ${subtext} hover:text-red-600 cursor-pointer bg-transparent border-none p-0 mt-1`}>
                Clear rating filter
              </button>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="w-full border-2 border-red-700 text-red-700 bg-transparent hover:bg-red-700 hover:text-white rounded-lg py-2.5 text-sm font-bold transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-10 py-8">

          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className={`text-3xl font-extrabold ${text} mb-1`}>{pageTitle}</h1>
              <p className={`text-sm ${subtext}`}>
                {filtered.length > 0
                  ? `Found ${filtered.length} service${filtered.length === 1 ? "" : "s"}`
                  : "No services match your filters"}
              </p>
            </div>
            <div className="flex gap-1.5">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`w-9 h-9 rounded-lg border text-base flex items-center justify-center transition-all cursor-pointer ${
                    view === v
                      ? "border-red-700 bg-red-50 text-red-700"
                      : dm ? "border-gray-600 bg-gray-800 text-gray-400 hover:border-red-700" : "border-gray-200 bg-white text-gray-400 hover:border-red-700"
                  }`}
                >
                  {v === "grid" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>

          {/* No results */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="text-5xl">🔍</span>
              <p className={`text-lg font-semibold ${text}`}>No services found</p>
              <p className={`text-sm ${subtext}`}>Try adjusting your filters</p>
              <button onClick={clearFilters} className="mt-2 px-6 py-2.5 bg-red-700 text-white font-bold rounded-lg text-sm hover:bg-red-800 transition-all cursor-pointer border-none">
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {paginated.length > 0 && view === "grid" && (
            <div className="grid grid-cols-3 gap-5 mb-9">
              {paginated.map((s) => {
                const imageUrl = s.image_url || "/images/service-placeholder.jpg";
                const categoryName = typeof s.category === "string" ? s.category : s.category?.name ?? "Service";
                const rating = Number(s.average_rating ?? (s as any).rating ?? 0);
                const providerName = s.user?.full_name ?? "Provider";
                const providerAvatar = s.user?.avatar_url || "/images/avatar-placeholder.png";
                const price = Number(s.price ?? 0);

                return (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/services/${s.id}`)}
                    className={`border rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 text-left ${cardBg} hover:shadow-lg`}
                    style={{ background: "none" }}
                  >
                    <div className="relative">
                      <img src={imageUrl} alt={s.title} className="w-full h-44 object-cover" />
                    </div>
                    <div className={`p-4 ${dm ? "bg-gray-800" : "bg-white"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{categoryName}</span>
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          <span className="text-amber-400">★</span>
                          <span className={text}>{rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${text} leading-snug mb-3 min-h-10`}>{s.title}</div>
                      <div className={`flex justify-between items-center pt-3 border-t ${border}`}>
                        <div className="flex items-center gap-2">
                          <img src={providerAvatar} alt={providerName} className="w-7 h-7 rounded-full object-cover" />
                          <span className={`text-xs font-medium ${subtext}`}>{providerName}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs uppercase tracking-wide ${subtext}`}>Starting at</div>
                          <div className="font-extrabold text-red-600 text-sm">${price.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* List view */}
          {paginated.length > 0 && view === "list" && (
            <div className="flex flex-col gap-3 mb-9">
              {paginated.map((s) => {
                const imageUrl = s.image_url || "/images/service-placeholder.jpg";
                const categoryName = typeof s.category === "string" ? s.category : s.category?.name ?? "Service";
                const rating = Number(s.average_rating ?? (s as any).rating ?? 0);
                const providerName = s.user?.full_name ?? "Provider";
                const providerAvatar = s.user?.avatar_url || "/images/avatar-placeholder.png";
                const price = Number(s.price ?? 0);

                return (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/services/${s.id}`)}
                    className={`border rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 text-left flex ${cardBg} hover:shadow-lg`}
                    style={{ background: "none" }}
                  >
                    <img src={imageUrl} alt={s.title} className="w-48 h-32 object-cover flex-shrink-0" />
                    <div className={`p-4 flex-1 flex flex-col justify-between ${dm ? "bg-gray-800" : "bg-white"}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{categoryName}</span>
                        </div>
                        <div className={`font-bold text-sm ${text} leading-snug`}>{s.title}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={providerAvatar} alt={providerName} className="w-6 h-6 rounded-full object-cover" />
                          <span className={`text-xs font-medium ${subtext}`}>{providerName}</span>
                          <span className="text-amber-400 text-xs ml-2">★ {rating.toFixed(1)}</span>
                        </div>
                        <div className="font-extrabold text-red-600 text-sm">${price.toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${dm ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-700"}`}
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center cursor-pointer transition-all ${
                    page === p
                      ? "bg-red-700 border-red-700 text-white"
                      : dm ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-700"
                  }`}
                >{p}</button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${dm ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-700"}`}
              >›</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}