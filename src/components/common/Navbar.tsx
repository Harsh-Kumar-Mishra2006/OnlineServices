import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  if (isAuthenticated && user?.role === "admin") {
    navLinks.push({ name: "Add Worker", href: "/add-worker" });
    navLinks.push({ name: "User Querries", href: "/admin-querries-list" });
    navLinks.push({ name: "All Assignments", href: "/all-assignments" });
    navLinks.push({ name: "Bills", href: "/admin/bills" });
  } else if (isAuthenticated && user?.role === "user") {
    navLinks.push({ name: "Querry", href: "/user-querry" });
    navLinks.push({ name: "My Bills", href: "/user/bills" });
  } else if (isAuthenticated && user?.role === "worker") {
    navLinks.push({ name: "Assignments", href: "/worker/assignments" });
    navLinks.push({ name: "Dashboard", href: "/worker/dashboard" });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-blue-500/10"
          : "bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                <span className="text-2xl">🏠</span>
              </div>
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Home<span className="text-blue-300">Service</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-sky-400 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-blue-600" : "bg-white"
                  }`}
                />
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white font-semibold shadow-2xl shadow-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-medium ${isScrolled ? "text-gray-900" : "text-white"}`}
                    >
                      {user?.name || "User"}
                    </p>
                    <p
                      className={`text-xs ${isScrolled ? "text-gray-500" : "text-blue-100"}`}
                    >
                      {user?.role || "user"}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isScrolled ? "text-gray-600" : "text-white"} ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-blue-500/20 py-2 border border-gray-100 overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{user?.username}
                          </p>
                          <p className="text-xs text-blue-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-black hover:to-emerald-800 transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-700">My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-gray-700">Settings</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors duration-150 text-red-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className={`relative overflow-hidden rounded-full px-6 py-2 font-semibold transition-all hover:scale-105 active:scale-95 ${
                    isScrolled
                      ? "text-blue-600 hover:bg-blue-50"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="relative overflow-hidden rounded-full bg-white px-6 py-2 font-semibold text-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-100 to-sky-100 transition-transform duration-500 hover:translate-x-0"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden relative z-50 p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
            }`}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-900" : "bg-white"
                } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-900" : "bg-white"
                } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-900" : "bg-white"
                } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-gradient-to-b from-blue-600 via-blue-500 to-sky-500 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible translate-x-full"
        }`}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-semibold text-white transition-all duration-300 hover:scale-110 hover:text-blue-200 ${
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-semibold text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-emerald-800 transition-all duration-300 hover:scale-110 hover:text-blue-200 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={`mt-4 rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-semibold text-white transition-all duration-300 hover:scale-110 hover:text-blue-200 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mt-4 rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
