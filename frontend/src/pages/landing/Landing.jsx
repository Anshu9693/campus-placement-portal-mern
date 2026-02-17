import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/common/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-[Montserrat] bg-gradient-to-br from-[#F8EFE2] to-[#B08B5E]">

      {/* HEADER */}
      <header className="w-full bg-[#5A371F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <div className="text-3xl font-extrabold tracking-wide">
            AVANI ENTERPRISES
          </div>

          <nav className="space-x-8 text-lg">
            <Link
              to="/login"
              className="hover:text-[#E8D5B5] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#B08B5E] px-5 py-2 rounded-xl font-semibold hover:bg-[#E8D5B5] hover:text-[#5A371F] transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#4A2C14] mb-6 leading-tight">
          Empowering Campus Placements
        </h1>

        <p className="text-xl md:text-2xl text-[#4A2C14]/90 mb-10 max-w-3xl">
          AVANI ENTERPRISES Placement Portal connects students,
          recruiters, and administrators into one powerful ecosystem
          designed for seamless campus hiring.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <Link
            to="/login"
            className="px-10 py-4 bg-[#5A371F] text-white rounded-2xl text-lg font-semibold shadow-xl hover:bg-[#4A2C14] hover:scale-105 transition-all duration-300"
          >
            🚀 Get Started
          </Link>

          <a
            href="#features"
            className="px-10 py-4 border-2 border-[#5A371F] text-[#5A371F] rounded-2xl text-lg font-semibold hover:bg-[#5A371F] hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="w-full max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        <div className="bg-white/90 rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-5xl mb-6">🎓</div>
          <h2 className="text-2xl font-bold text-[#5A371F] mb-3">
            For Students
          </h2>
          <p className="text-[#5A371F]/80">
            Build profile, upload resume, apply to drives, and track
            application status in real-time.
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-5xl mb-6">🏢</div>
          <h2 className="text-2xl font-bold text-[#5A371F] mb-3">
            For Recruiters
          </h2>
          <p className="text-[#5A371F]/80">
            Post placement drives, filter candidates, shortlist and
            manage hiring efficiently.
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
          <div className="text-5xl mb-6">🛡️</div>
          <h2 className="text-2xl font-bold text-[#5A371F] mb-3">
            For Admins
          </h2>
          <p className="text-[#5A371F]/80">
            Oversee placement workflow, manage users, and generate
            detailed analytics & reports.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#5A371F] text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-4xl font-extrabold">1000+</h3>
            <p className="mt-2 text-[#E8D5B5]">Registered Students</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold">75+</h3>
            <p className="mt-2 text-[#E8D5B5]">Recruiting Companies</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold">500+</h3>
            <p className="mt-2 text-[#E8D5B5]">Successful Placements</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 px-6 bg-[#F8EFE2]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#5A371F] mb-8">
            Why Choose AVANI ENTERPRISES?
          </h2>

          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div>
              <h3 className="text-xl font-semibold text-[#5A371F] mb-2">
                ✔ Seamless Workflow
              </h3>
              <p className="text-[#5A371F]/80">
                Complete automation from job posting to final selection.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#5A371F] mb-2">
                ✔ Real-Time Tracking
              </h3>
              <p className="text-[#5A371F]/80">
                Monitor applications and hiring status instantly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#5A371F] mb-2">
                ✔ Secure & Reliable
              </h3>
              <p className="text-[#5A371F]/80">
                Role-based authentication with secure data handling.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#5A371F] mb-2">
                ✔ Modern Dashboard
              </h3>
              <p className="text-[#5A371F]/80">
                Clean UI built with MERN stack for smooth experience.
              </p>
            </div>
          </div>
        </div>
      </section>
        <Footer/>
    </div>
  );
}