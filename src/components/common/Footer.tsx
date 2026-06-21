import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Plumbing", href: "#" },
      { name: "Electrical", href: "#" },
      { name: "Painting", href: "#" },
      { name: "TV Installation", href: "#" },
      { name: "Cleaning", href: "#" },
      { name: "Handyman", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
      { name: "Partners", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  const socialIcons = [
    { name: "Facebook", icon: "📘", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
    { name: "Instagram", icon: "📸", href: "#" },
    { name: "YouTube", icon: "▶️", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-blue-950 to-black text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                  <span className="text-2xl">🏠</span>
                </div>
              </div>
              <span className="text-2xl font-bold">
                Home<span className="text-blue-400">Service</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your trusted platform for booking skilled home service
              professionals. Making household chores effortless since 2020.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                  aria-label={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Services
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full"></span>
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block relative group"
                  >
                    <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                    <span className="group-hover:ml-4 transition-all duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full"></span>
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block relative group"
                  >
                    <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                    <span className="group-hover:ml-4 transition-all duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full"></span>
            </h3>
            <ul className="space-y-2.5 mb-6">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block relative group"
                  >
                    <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                    <span className="group-hover:ml-4 transition-all duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95">
                  <span className="relative z-10">→</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400 to-sky-400 transition-transform duration-500 group-hover:translate-x-0"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>© {currentYear} HomeService. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤️</span>
                <span className="hidden sm:inline">for your home</span>
              </span>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:scale-105"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:scale-105"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:scale-105"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
