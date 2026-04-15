"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <Navbar />

      {/* Hero Section with Clean Demarcated Images */}
      <section className="relative w-full overflow-hidden min-h-[700px] flex items-center">
        {/* Three Column Layout */}
        <div className="w-full flex">
          {/* LEFT - Rogan Image (No Fade) */}
          <div className="w-1/4 relative h-[700px]">
            <Image
              src="/assets/images/rogan-bg.jpg"
              alt="Podcaster"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* CENTER - Content */}
          <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-8 py-20">
            <div className="text-center max-w-3xl">
              {/* Animated Title */}
              <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
                LISTEN UP!!
              </h1>
              
              <p className="text-3xl text-gray-900 mb-4 font-bold animate-fade-in">
                Decentralized Podcast Platform
              </p>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed animate-slide-up">
                Upload episodes, get paid per listen. <span className="font-semibold text-orange-600">No middlemen.</span> <span className="font-semibold text-red-600">No censorship.</span>
                <br />
                Built on <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Shelby & Aptos blockchain.</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex justify-center gap-6 mb-12 animate-slide-up-delayed">
                <Link
                  href="/creator"
                  className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transform"
                >
                  <span className="relative z-10">Start Creating</span>
                </Link>
                
                <Link
                  href="/browse"
                  className="group bg-white text-orange-500 border-3 border-orange-500 px-10 py-5 rounded-xl font-bold text-xl hover:bg-orange-500 hover:text-white transition-all shadow-2xl hover:scale-105 transform"
                >
                  Browse Podcasts
                </Link>
              </div>

              {/* Logo with Partner Logos */}
              <div className="flex flex-col items-center animate-bounce-slow">
                {/* Main Logo */}
                <Image
                  src="/assets/images/logo.png"
                  alt="Shel-PodVault"
                  width={400}
                  height={200}
                  className="w-auto h-48 drop-shadow-2xl mb-6"
                />
                
                {/* "Built on" Text */}
                <p className="text-sm text-gray-500 mb-3 font-medium">BUILT ON</p>
                
                {/* Partner Logos Row */}
                <div className="flex items-center gap-8">
                  {/* Aptos Logo */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                    <Image
                      src="/assets/images/aptos-logo.png"
                      alt="Aptos"
                      width={80}
                      height={80}
                      className="w-auto h-12"
                    />
                  </div>
                  
                  {/* Shelby Logo */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                    <Image
                      src="/assets/images/shelby-logo.png"
                      alt="Shelby Protocol"
                      width={80}
                      height={80}
                      className="w-auto h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Elon Image (No Fade) */}
          <div className="w-1/4 relative h-[700px]">
            <Image
              src="/assets/images/hero-bg.jpg"
              alt="Podcaster"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="animate-count-up">
              <div className="text-5xl font-black mb-2">100%</div>
              <div className="text-lg font-medium">Creator Earnings</div>
            </div>
            <div className="animate-count-up delay-100">
              <div className="text-5xl font-black mb-2">$0</div>
              <div className="text-lg font-medium">Platform Fees</div>
            </div>
            <div className="animate-count-up delay-200">
              <div className="text-5xl font-black mb-2">∞</div>
              <div className="text-lg font-medium">Freedom</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-12">
            What Creators Say
          </h2>
          
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
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
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
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
          <h2 className="text-5xl font-black text-white mb-6 animate-pulse">
            Ready to Own Your Content?
          </h2>
          <p className="text-2xl text-white/95 mb-10 leading-relaxed">
            Join the future of podcasting. <span className="font-bold">No gatekeepers.</span> Just you and your audience.
          </p>
          <Link
            href="/creator"
            className="group relative inline-block bg-white text-orange-500 px-12 py-6 rounded-xl font-black text-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/50 hover:scale-110 transform"
          >
            <span className="relative z-10">Get Started Now →</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></span>
          </Link>
        </div>
      </section>
    </div>
  );
}