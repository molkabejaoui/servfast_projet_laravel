import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const dm = darkMode;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <nav
        className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${
          dm ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between px-16 h-16">
          {/* Logo */}
          <a
            href="/"
            className={`font-extrabold text-xl tracking-tight no-underline ${dm ? "text-red-400" : "text-red-700"}`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            ServFast
          </a>

          {/* Navigation Links */}
          <ul className="flex gap-9 list-none m-0 p-0">
            <li>
              <a
                href="/services?type=Solutions"
                className={`text-sm font-medium no-underline transition-colors ${
                  dm ? "text-gray-300 hover:text-red-400" : "text-red-700 font-semibold"
                }`}
              >
                Solutions
              </a>
            </li>
            <li>
              <a
                href="/services?type=Enterprise"
                className={`text-sm font-medium no-underline transition-colors ${
                  dm ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-red-700"
                }`}
              >
                Enterprise
              </a>
            </li>
            <li>
              <a
                href="/services"
                className={`text-sm font-medium no-underline transition-colors ${
                  dm ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-red-700"
                }`}
              >
                All Services
              </a>
            </li>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={dm ? "Switch to light mode" : "Switch to dark mode"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all text-base border-none cursor-pointer ${
                dm ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {dm ? "☀️" : "🌙"}
            </button>

            {user ? (
              <div className="relative">
                {/* Avatar button */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm transition-all cursor-pointer border-none ${
                    dm ? "bg-red-600 hover:bg-red-500" : "bg-red-700 hover:bg-red-800"
                  }`}
                  title="Your profile"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </button>

                {/* Dropdown */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop to close */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div
                      className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl z-50 overflow-hidden border ${
                        dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                      }`}
                    >
                      {/* User info */}
                      <div className={`px-4 py-3 border-b ${dm ? "border-gray-700" : "border-gray-100"}`}>
                        <p className={`font-bold text-sm ${dm ? "text-white" : "text-gray-900"}`}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={`text-xs mt-0.5 truncate ${dm ? "text-gray-400" : "text-gray-500"}`}>
                          {user.email}
                        </p>
                        <span className={`inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                          user.role === 'PROVIDER'
                            ? dm ? "bg-blue-900 text-blue-300" : "bg-blue-50 text-blue-700"
                            : dm ? "bg-red-900 text-red-300" : "bg-red-50 text-red-700"
                        }`}>
                          {user.role}
                        </span>
                      </div>

                      {/* Menu items */}
                      {[
                        { label: "👤  My Profile", path: "/profile" },   // ← fixed from /dashboard
                        { label: "💬  Messages", path: "/messages" },
                        ...(user.role === 'PROVIDER' ? [{ label: "🛠️  Provider Dashboard", path: "/provider" }] : []),
                      ].map(({ label, path }) => (
                        <button
                          key={path}
                          onClick={() => { navigate(path); setShowProfileMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-none cursor-pointer ${
                            dm ? "text-gray-200 bg-gray-800 hover:bg-gray-700" : "text-gray-700 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}

                      <button
                        onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold border-t cursor-pointer border-none ${
                          dm ? "border-gray-700 text-red-400 bg-gray-800 hover:bg-gray-700" : "border-gray-100 text-red-700 bg-white hover:bg-red-50"
                        }`}
                      >
                        🚪  Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className={`text-sm font-medium no-underline transition-colors ${
                    dm ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-red-700"
                  }`}
                >
                  Sign In
                </a>
                <button
                  className={`text-sm font-bold px-5 py-2 rounded-lg transition-all hover:-translate-y-0.5 cursor-pointer border-none text-white ${
                    dm ? "bg-red-600 hover:bg-red-500" : "bg-red-700 hover:bg-red-800"
                  }`}
                  style={{ boxShadow: "0 3px 10px rgba(192,0,27,0.3)" }}
                  onClick={() => navigate("/register")}
                >
                  Join
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
