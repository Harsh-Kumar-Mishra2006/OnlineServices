import React from "react";

const HeroPage: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-16 sm:py-24 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Trusted by 50,000+ homeowners
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Book skilled</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                home professionals
              </span>
              <br />
              <span className="text-gray-900">in minutes</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From painters and electricians to plumbers and TV operators — find
              vetted experts for all your household chores. Book instantly, pay
              securely, and get the job done right.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm py-3.5 pl-12 pr-4 text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95">
                Find experts
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/32?img=${i + 10}`}
                      alt="User"
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">2.5k+</span>{" "}
                  bookings today
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>
                  <span className="font-semibold text-gray-900">4.9/5</span>{" "}
                  average rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Main card */}
              <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-6 shadow-2xl shadow-blue-500/10 border border-white/50">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🔧", label: "Plumber", color: "blue" },
                    { icon: "⚡", label: "Electrician", color: "yellow" },
                    { icon: "🎨", label: "Painter", color: "purple" },
                    { icon: "📺", label: "TV Operator", color: "green" },
                    { icon: "🧹", label: "Cleaner", color: "pink" },
                    { icon: "🔨", label: "Handyman", color: "orange" },
                  ].map((service, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl bg-${service.color}-50/50 p-3 backdrop-blur-sm border border-${service.color}-100/50 transition-all hover:scale-105 hover:shadow-lg cursor-pointer`}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {service.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 animate-bounce rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                ⚡ Book now
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg border border-gray-100">
                ✅ Verified pros
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
