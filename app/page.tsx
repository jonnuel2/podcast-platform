"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  const testimonials = [
    {
      quote: "Finally, a platform that pays me what I deserve!",
      author: "Independent Creator",
      role: "Tech Podcaster"
    },
    {
      quote: "No more worrying about being deplatformed.",
      author: "Political Commentator",
      role: "News Analysis"
    },
    {
      quote: "My listeners love the pay-per-listen model!",
      author: "Education Creator",
      role: "History Podcast"
    }
  ];

  // Auto-rotate hero carousel
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % 3); // 3 podcaster images
    }, 5000); // Change every 5 seconds
    return () => clearInterval(heroTimer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-orange-400">
      <Navbar />

      {/* Hero Section with Podcaster Carousel */}
      <section className="relative w-full overflow-hidden min-h-[700px] flex items-center">
        <div className="w-full flex items-center justify-between px-12 py-20">
          {/* LEFT - Content */}
          <div className="w-1/2 z-10">
            <div className="max-w-2xl">
              {/* Main Title */}
              <h1 className="text-8xl font-black mb-6 text-white drop-shadow-2xl leading-tight">
                LISTEN UP!!
              </h1>
              
              <p className="text-3xl text-white/95 mb-4 font-bold">
                Decentralized Podcast Platform
              </p>
              
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Upload episodes, get paid per listen.<br />
                <span className="font-semibold">No middlemen.</span> <span className="font-semibold">No censorship.</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex gap-6 mb-12">
                <Link
                  href="/creator"
                  className="group relative bg-white text-orange-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
                >
                  Start Creating
                </Link>
                
                <Link
                  href="/browse"
                  className="group bg-transparent text-white border-3 border-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-orange-600 transition-all shadow-2xl hover:scale-105 transform"
                >
                  Browse Podcasts
                </Link>
              </div>

              {/* Partner Logos */}
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                  <Image
                    src="/assets/images/aptos-logo.png"
                    alt="Aptos"
                    width={80}
                    height={80}
                    className="w-auto h-10 opacity-90"
                  />
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                  <Image
                    src="/assets/images/shelby-logo.png"
                    alt="Shelby"
                    width={80}
                    height={80}
                    className="w-auto h-10 opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Podcaster Carousel with Curved Edges */}
          <div className="w-1/2 flex justify-end pr-12">
            <div className="relative">
              <div className="relative w-[500px] h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                {/* Image 1 */}
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentHeroSlide === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src="/assets/images/podcaster.png"
                    alt="Podcaster 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Image 2 */}
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentHeroSlide === 1 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src="/assets/images/podcaster2.png"
                    alt="Podcaster 2"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Image 3 */}
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentHeroSlide === 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src="/assets/images/podcaster3.png"
                    alt="Podcaster 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-3 mt-6">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentHeroSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-xl font-semibold text-gray-700">Creator Earnings</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                $0
              </div>
              <div className="text-xl font-semibold text-gray-700">Platform Fees</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-xl font-semibold text-gray-700">Freedom</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-white mb-12">
            What Creators Say
          </h2>
          
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentTestimonialSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentTestimonialSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20">
                  <p className="text-2xl text-white mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-orange-400 font-semibold text-lg">
                    — {testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonialSlide
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-black text-white mb-6">
            Ready to Own Your Content?
          </h2>
          <p className="text-2xl text-white/95 mb-10 leading-relaxed">
            Join the future of podcasting. <span className="font-bold">No gatekeepers.</span> Just you and your audience.
          </p>
          <Link
            href="/creator"
            className="inline-block bg-white text-orange-500 px-12 py-6 rounded-2xl font-black text-2xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-110 transform"
          >
            Get Started Now →
          </Link>
        </div>
      </section>
    </div>
  );
}