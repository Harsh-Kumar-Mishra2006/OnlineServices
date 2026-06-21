import React from "react";

const DescriptionPage: React.FC = () => {
  const services = [
    {
      icon: "🎨",
      title: "Painting & Wallpaper",
      description:
        "Transform your space with professional painters. From single rooms to full houses, get flawless finishes and expert wallpaper installation.",
      features: ["Interior/Exterior", "Wallpaper removal", "Texture finishing"],
      color: "purple",
    },
    {
      icon: "🔧",
      title: "Plumbing Services",
      description:
        "Licensed plumbers for all your needs — from leaky faucets to complete bathroom installations. Available 24/7 for emergencies.",
      features: ["Pipe repairs", "Fixture installation", "Drain cleaning"],
      color: "blue",
    },
    {
      icon: "⚡",
      title: "Electrical Work",
      description:
        "Certified electricians handling everything from light fixtures to complete rewiring. Safety is our top priority.",
      features: ["Wiring", "Panel upgrades", "Smart home setup"],
      color: "yellow",
    },
    {
      icon: "📺",
      title: "TV & Entertainment Setup",
      description:
        "Professional TV mounting, sound system installation, and home theater setup. Get the perfect viewing experience.",
      features: ["Wall mounting", "Cable management", "Sound calibration"],
      color: "green",
    },
    {
      icon: "🧹",
      title: "Home Cleaning",
      description:
        "Deep cleaning services for your entire home. Move-in/move-out cleaning, carpet cleaning, and regular maintenance.",
      features: ["Deep clean", "Carpet cleaning", "Window washing"],
      color: "pink",
    },
    {
      icon: "🔨",
      title: "Handyman Services",
      description:
        "General home repairs and improvements. Furniture assembly, shelving installation, and minor renovations.",
      features: ["Assembly", "Repairs", "Installations"],
      color: "orange",
    },
  ];

  return (
    <section className="px-6 py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Everything you need for your
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              home
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Browse our curated list of professional services. All providers are
            vetted, insured, and ready to help with your household chores.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] border border-gray-100"
            >
              {/* Color accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-${service.color}-500`}
              />

              <div className="mt-2">
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-${service.color}-100 text-3xl`}
                >
                  {service.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="h-4 w-4 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`mt-6 w-full rounded-xl bg-${service.color}-50 px-4 py-2.5 font-semibold text-${service.color}-700 transition-all hover:bg-${service.color}-100 hover:scale-[1.02] active:scale-95`}
                >
                  Book now →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Ready to get started?
          </h3>
          <p className="mt-2 text-blue-100 max-w-2xl mx-auto">
            Join thousands of happy homeowners who trust us for their home
            service needs. Book your first service today with zero booking fees.
          </p>
          <button className="mt-6 rounded-2xl bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95">
            Explore all services
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🔒", label: "Secure payments", desc: "100% protected" },
            { icon: "✅", label: "Vetted pros", desc: "Background checked" },
            { icon: "💬", label: "24/7 support", desc: "We're here to help" },
            { icon: "⭐", label: "Satisfaction", desc: "Money-back guarantee" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DescriptionPage;
