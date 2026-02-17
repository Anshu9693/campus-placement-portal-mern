import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-[Montserrat] bg-[#F8EFE2] text-[#4A2C14]">
      {/* Sticky Header */}
       <header className="w-full bg-[#5A371F] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/image.png"
            alt="Avani Enterprises Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-lg sm:text-xl font-bold tracking-wide">
            AVANI <span className="text-[#B08B5E]">ENTERPRISES</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/login"
            className="text-sm font-semibold uppercase tracking-wide hover:text-[#B08B5E] transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-[#5A371F] px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#B08B5E] hover:text-white transition-all duration-300"
          >
            Join Portal
          </Link>
        </nav>
      </div>
    </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#B08B5E]/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#B08B5E]/10 border border-[#B08B5E]/20">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7B4F1D]">The Future of Campus Recruitment</p>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter max-w-5xl">
          Empowering <span className="text-[#B08B5E]">Careers</span>, <br /> 
          Simplifying <span className="text-[#B08B5E]">Hiring</span>.
        </h1>

        <p className="text-base sm:text-xl text-[#4A2C14]/70 mb-12 max-w-2xl font-medium leading-relaxed">
          A unified ecosystem connecting students, recruiters, and administrators for a seamless, data-driven placement journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link
            to="/login"
            className="px-10 py-5 bg-[#5A371F] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-brown-900/40 hover:bg-[#4A2C14] hover:-translate-y-1 transition-all"
          >
            Get Started Now
          </Link>
          <a
            href="#features"
            className="px-10 py-5 border-2 border-[#5A371F] text-[#5A371F] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#5A371F] hover:text-white transition-all"
          >
            See How It Works
          </a>
        </div>
      </main>

      {/* Trust Ribbon */}
      <section className="bg-white py-10 border-y border-[#EADCC8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Registered Students', val: '2,500+' },
            { label: 'Partner Corporations', val: '150+' },
            { label: 'Job Offers Made', val: '980+' },
            { label: 'Success Rate', val: '94%' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left border-l-2 border-[#B08B5E]/20 pl-4">
              <p className="text-2xl font-black text-[#5A371F]">{stat.val}</p>
              <p className="text-[10px] font-bold text-[#B08B5E] uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles / Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#5A371F]">Tailored For Success</h2>
          <div className="h-1 w-20 bg-[#B08B5E] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              role: 'Students', 
              icon: '👨‍🎓', 
              desc: 'Build a dynamic profile, showcase your technical skills, and apply to top-tier companies with a single click.' 
            },
            { 
              role: 'Recruiters', 
              icon: '🏢', 
              desc: 'Launch recruitment drives, filter talent using automated screening, and manage your pipeline efficiently.' 
            },
            { 
              role: 'Admins', 
              icon: '🛡️', 
              desc: 'Oversee the entire placement cycle, verify candidate data, and generate deep-dive analytical reports.' 
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#EADCC8] hover:shadow-2xl transition-all group hover:-translate-y-2 duration-500">
              <div className="text-5xl mb-8 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
              <h3 className="text-xl font-black text-[#5A371F] mb-4 uppercase tracking-tighter">For {item.role}</h3>
              <p className="text-sm text-[#4A2C14]/60 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-[#5A371F] py-24 px-6 text-white overflow-hidden relative">
        <div className="absolute right-0 bottom-0 opacity-10 text-[20rem] font-black leading-none select-none translate-y-1/2 translate-x-1/4">
          AVANI
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 leading-tight tracking-tight">Built on the Modern <br/><span className="text-[#B08B5E]">MERN Tech-Stack</span>.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { t: 'Secure Access', d: 'Role-based authentication with JWT security.' },
                { t: 'Live Tracking', d: 'Real-time status updates for applications.' },
                { t: 'PDF Engine', d: 'Instant resume previews and downloads.' },
                { t: 'Analytics', d: 'Data visualization for placement trends.' }
              ].map((point, i) => (
                <div key={i}>
                  <p className="text-[#B08B5E] font-black text-xs uppercase tracking-widest mb-1">{point.t}</p>
                  <p className="text-xs text-white/60 font-medium leading-relaxed">{point.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-sm">
             <p className="italic text-xl font-medium text-[#B08B5E]">"Our mission is to digitize the campus hiring experience, making it transparent, fast, and accessible for everyone involved."</p>
             <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#B08B5E] rounded-full"></div>
                <div>
                  <p className="font-black text-sm uppercase">Development Team</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Avani Enterprises</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}