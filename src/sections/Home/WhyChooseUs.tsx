import React from "react";

const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: "👨‍🔧",
      title: "Skilled Professionals",
      description:
        "All our service providers are certified, experienced, and thoroughly vetted to ensure quality work.",
      stat: "500+ Experts",
    },
    {
      icon: "⚡",
      title: "Fast Response Time",
      description:
        "Get matched with a professional within minutes. Most services are available within 2 hours.",
      stat: "< 30 min avg",
    },
    {
      icon: "💰",
      title: "Competitive Pricing",
      description:
        "Fair, transparent pricing with no hidden fees. Get quality service at affordable rates.",
      stat: "20% lower avg",
    },
    {
      icon: "🛡️",
      title: "Insurance & Safety",
      description:
        "All professionals are fully insured and follow strict safety protocols for your peace of mind.",
      stat: "100% insured",
    },
    {
      icon: "📱",
      title: "Seamless Experience",
      description:
        "Book, track, and pay everything through our intuitive platform. Real-time updates.",
      stat: "4.9⭐ rating",
    },
    {
      icon: "🤝",
      title: "Satisfaction Guarantee",
      description:
        "We stand behind our service. If you're not happy, we'll fix it or refund your money.",
      stat: "99% satifaction",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            The smart choice for
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              home services
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Here's why thousands of homeowners trust us with their home service
            needs
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>

              {/* Stat Badge */}
              <div className="mt-4 inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-100">
                {reason.stat}
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Comparison / Trust Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-gray-900">
                We're different from the rest
              </h3>
              <p className="mt-2 text-gray-600">
                See how we compare to traditional service providers
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Vetted professionals
                    </div>
                    <div className="text-sm text-gray-500">
                      Background-checked and certified
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Transparent pricing
                    </div>
                    <div className="text-sm text-gray-500">
                      No hidden fees or surprises
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      24/7 support
                    </div>
                    <div className="text-sm text-gray-500">
                      We're always here to help
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Quality guarantee
                    </div>
                    <div className="text-sm text-gray-500">
                      Satisfaction or your money back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white w-full">
            <div className="flex-1 text-left">
              <h4 className="text-2xl font-bold">Ready to get started?</h4>
              <p className="text-blue-100">
                Join thousands of satisfied customers today
              </p>
            </div>
            <button className="rounded-2xl bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 whitespace-nowrap">
              Book your service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
