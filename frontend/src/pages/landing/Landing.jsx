import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-[Montserrat] bg-gradient-to-br from-[#F8EFE2] to-[#B08B5E]">
      <header className="w-full bg-[#5A371F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:items-center sm:justify-between">
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide text-center sm:text-left">
            AVANI ENTERPRISES
          </div>

          <nav className="flex items-center justify-center sm:justify-end gap-3 sm:gap-6 text-sm sm:text-base lg:text-lg">
            <Link to="/login" className="hover:text-[#E8D5B5] transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#B08B5E] px-4 sm:px-5 py-2 rounded-xl font-semibold hover:bg-[#E8D5B5] hover:text-[#5A371F] transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#4A2C14] mb-5 sm:mb-6 leading-tight max-w-4xl">
          Empowering Campus Placements
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#4A2C14]/90 mb-8 sm:mb-10 max-w-3xl">
          AVANI ENTERPRISES Placement Portal connects students, recruiters, and administrators into one powerful ecosystem designed for seamless campus hiring.
        </p>

        <div className="w-full max-w-md sm:max-w-none flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <Link
            to="/login"
            className="px-6 sm:px-10 py-3 sm:py-4 bg-[#5A371F] text-white rounded-2xl text-base sm:text-lg font-semibold shadow-xl hover:bg-[#4A2C14] hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="px-6 sm:px-10 py-3 sm:py-4 border-2 border-[#5A371F] text-[#5A371F] rounded-2xl text-base sm:text-lg font-semibold hover:bg-[#5A371F] hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </main>

      <section id="features" className="w-full max-w-6xl mx-auto py-14 sm:py-20 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
        <div className="bg-white/90 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-4xl sm:text-5xl mb-5 sm:mb-6">Students</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#5A371F] mb-3">For Students</h2>
          <p className="text-sm sm:text-base text-[#5A371F]/80">
            Build profile, upload resume, apply to drives, and track application status in real-time.
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-4xl sm:text-5xl mb-5 sm:mb-6">Recruiters</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#5A371F] mb-3">For Recruiters</h2>
          <p className="text-sm sm:text-base text-[#5A371F]/80">
            Post placement drives, filter candidates, shortlist and manage hiring efficiently.
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-4xl sm:text-5xl mb-5 sm:mb-6">Admins</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#5A371F] mb-3">For Admins</h2>
          <p className="text-sm sm:text-base text-[#5A371F]/80">
            Oversee placement workflow, manage users, and generate detailed analytics and reports.
          </p>
        </div>
      </section>

      <section className="bg-[#5A371F] text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold">1000+</h3>
            <p className="mt-2 text-[#E8D5B5] text-sm sm:text-base">Registered Students</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold">75+</h3>
            <p className="mt-2 text-[#E8D5B5] text-sm sm:text-base">Recruiting Companies</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold">500+</h3>
            <p className="mt-2 text-[#E8D5B5] text-sm sm:text-base">Successful Placements</p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F8EFE2]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A371F] mb-8">Why Choose AVANI ENTERPRISES?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#5A371F] mb-2">Seamless Workflow</h3>
              <p className="text-sm sm:text-base text-[#5A371F]/80">Complete automation from job posting to final selection.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#5A371F] mb-2">Real-Time Tracking</h3>
              <p className="text-sm sm:text-base text-[#5A371F]/80">Monitor applications and hiring status instantly.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#5A371F] mb-2">Secure and Reliable</h3>
              <p className="text-sm sm:text-base text-[#5A371F]/80">Role-based authentication with secure data handling.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#5A371F] mb-2">Modern Dashboard</h3>
              <p className="text-sm sm:text-base text-[#5A371F]/80">Clean UI built with MERN stack for smooth experience.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
