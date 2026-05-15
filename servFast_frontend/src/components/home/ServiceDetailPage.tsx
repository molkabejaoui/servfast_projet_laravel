import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "CEO at FinTech Innovators",
    rating: 5,
    date: "2 days ago",
    comment:
      "Marcus delivered beyond expectations. The brand system he built for our enterprise platform is incredibly versatile and professionally executed. The attention to typography and spacing is top-tier.",
    avatar: "S",
  },
  {
    id: 2,
    name: "David Lawson",
    role: "Product Lead at Velocity SaaS",
    rating: 4,
    date: "1 week ago",
    comment:
      "Exceptional work. The delivery was fast, and the quality of the sharp aesthetic he uses really made our service stand out in a crowded market.",
    avatar: "D",
  },
];

const ratingBreakdown = [
  { stars: 5, count: 189 },
  { stars: 4, count: 12 },
  { stars: 3, count: 4 },
  { stars: 2, count: 0 },
  { stars: 1, count: 3 },
];

export default function ServiceDetailPage() {
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
  ];

  const totalReviews = ratingBreakdown.reduce((a, b) => a + b.count, 0);

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 1280 }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <a href="#" className="hover:text-red-700 transition-colors">Graphics & Design</a>
          <span>›</span>
          <a href="#" className="hover:text-red-700 transition-colors">Enterprise Brand Identity</a>
          <span>›</span>
          <span className="text-gray-600 font-medium">Marcus Chen</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="col-span-2">

            {/* Title */}
            <h1
              className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Premium Enterprise Brand Identity & Scalable Design System
            </h1>

            {/* Provider row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <span className="text-sm font-semibold text-gray-700">Marcus Chen</span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">4.9 (314 reviews)</span>
            </div>

            {/* Main image */}
            <div className="rounded-2xl overflow-hidden mb-3 bg-gray-50">
              <img
                src={images[activeImage]}
                alt="Service preview"
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mb-8">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i ? "border-red-700" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-20 h-14 object-cover" />
                </button>
              ))}
            </div>

            {/* Service Overview */}
            <div className="mb-8">
              <h2
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Service Overview
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                I provide a comprehensive brand identity solution tailored for high-growth enterprises and established corporations seeking a modern, authoritative visual presence. This is not just a logo; it is a full-scale design ecosystem engineered for scalability and professional reliability.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Our process includes deep industry research, competitive analysis, and multiple iterations to ensure your brand projects efficiency and speed. Whether you are launching a new product line or refreshing a legacy brand, our sharp aesthetic ensures clarity across all digital and physical touchpoints.
              </p>
              <ul className="space-y-2">
                {[
                  "Complete Brand Style Guide (Typography, Color, Grid)",
                  "High-Density Interface Component Library",
                  "Enterprise-Grade Stationery & Collateral Design",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-700 mt-0.5 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* About the Provider */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                About the Provider
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-red-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-0.5">Marcus Chen</div>
                  <div className="text-xs text-gray-400 mb-3">Executive Creative Director — 12+ Years Exp.</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Specializing in corporate identity systems for Fintech and Tech SaaS industries. Marcus has led design for Fortune 500 companies and helped over 200 startups scale their visual presence with authority and precision.
                  </p>
                  <a href="#" className="text-sm text-red-700 font-semibold hover:underline">
                    View Portfolio →
                  </a>
                </div>
              </div>
            </div>

            {/* Client Feedback */}
            <div className="mb-8">
              <h2
                className="text-lg font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Client Feedback
              </h2>

              {/* Rating summary */}
              <div className="flex items-start gap-10 mb-8 p-6 bg-gray-50 rounded-2xl">
                <div className="text-center">
                  <div
                    className="text-5xl font-extrabold text-gray-900 mb-1"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    4.9
                  </div>
                  <div className="text-yellow-400 text-lg mb-1">★★★★★</div>
                  <div className="text-xs text-gray-400">{totalReviews} Total Reviews</div>
                </div>
                <div className="flex-1">
                  {ratingBreakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500 w-8">{row.stars} ★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-700 h-2 rounded-full"
                          style={{ width: `${(row.count / totalReviews) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                        <div className="text-xs text-gray-400">{review.role}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Sticky sidebar) ── */}
          <div className="col-span-1">
            <div className="sticky top-24">
              <div
                className="border border-gray-100 rounded-2xl p-6 mb-4"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {/* Package name & price */}
                <div className="flex justify-between items-center mb-5">
                  <span className="text-sm font-bold text-gray-700">Standard Enterprise</span>
                  <span
                    className="text-2xl font-extrabold text-gray-900"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    $1,249
                  </span>
                </div>

                {/* Delivery info */}
                <div className="space-y-2 mb-6">
                  {[
                    { icon: "◷", text: "7 Days Delivery" },
                    { icon: "↺", text: "2 Revisions" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-red-700">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <button
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-sm mb-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: "0 4px 14px rgba(192,0,27,0.3)" }}
                >
                  Order Now →
                </button>
                <button className="w-full border-2 border-gray-200 hover:border-red-700 text-gray-700 hover:text-red-700 font-semibold py-3 rounded-xl text-sm mb-4 transition-all duration-200">
                  Contact Marcus
                </button>

                <div className="text-center text-xs text-gray-400 mb-5">
                  100% Satisfaction Guarantee
                </div>

                {/* Enterprise perks */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Enterprise Perks
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Commercial Use License",
                      "Source Files Included (Figma, AI)",
                      "Brand Implementation Consultation",
                    ].map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-red-700 font-bold mt-0.5">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Share button */}
              <button className="w-full border border-gray-100 rounded-xl py-2.5 text-sm text-gray-500 hover:border-red-700 hover:text-red-700 transition-all duration-200 font-medium">
                Share this service
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}