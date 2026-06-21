import React, { useState } from "react";

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      text: "I needed a plumber urgently at 10 PM, and within 30 minutes, I had a professional at my door. The service was exceptional, and the pricing was transparent. Highly recommend!",
      service: "Plumbing",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Property Manager",
      image: "https://i.pravatar.cc/100?img=2",
      rating: 5,
      text: "Managing multiple properties used to be a nightmare until I found this platform. Now I can book painters, electricians, and cleaners for all my properties in one place.",
      service: "Property Management",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "New Homeowner",
      image: "https://i.pravatar.cc/100?img=3",
      rating: 5,
      text: "As a first-time homeowner, I was overwhelmed with all the work needed. This platform made it so easy to find reliable professionals. The TV mounting and painting services were top-notch!",
      service: "Multiple Services",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Business Owner",
      image: "https://i.pravatar.cc/100?img=4",
      rating: 4,
      text: "We use this service for all our office maintenance needs. The electricians are always punctual, professional, and get the job done right the first time. Great value for money.",
      service: "Electrical",
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Interior Designer",
      image: "https://i.pravatar.cc/100?img=5",
      rating: 5,
      text: "I recommend this platform to all my clients. The painters are incredibly skilled, and the wallpaper installation is flawless. It's my go-to for reliable home service professionals.",
      service: "Painting & Wallpaper",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            What our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              customers say
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real stories from real people who've used our services
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-50 rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative">
                      <svg
                        className="absolute -top-2 -left-2 w-8 h-8 text-blue-200 opacity-50"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                      >
                        <path d="M10 8c-3.314 0-6 2.686-6 6v2c0 3.314 2.686 6 6 6s6-2.686 6-6v-2c0-3.314-2.686-6-6-6zm12 0c-3.314 0-6 2.686-6 6v2c0 3.314 2.686 6 6 6s6-2.686 6-6v-2c0-3.314-2.686-6-6-6z" />
                      </svg>
                      <p className="pl-6 text-lg text-gray-700 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Service: {testimonial.service}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Join 50,000+ happy customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
