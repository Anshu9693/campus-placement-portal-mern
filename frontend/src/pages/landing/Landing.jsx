import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-[Montserrat] bg-[#F8EFE2] text-[#4A2C14]">
      {/* Sticky Header */}
      <header className="w-full bg-[#5A371F] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img
              src="/image.png"
              alt="Avani Enterprises Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-[#B08B5E]/30"
            />
            <span className="text-sm sm:text-xl font-bold tracking-wide whitespace-nowrap">
              AVANI <span className="text-[#B08B5E]">ENTERPRISES</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/login"
              className="text-[10px] sm:text-sm font-semibold uppercase tracking-wide hover:text-[#B08B5E] transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#FFFBF5] text-[#5A371F] px-3 sm:px-6 py-2 rounded-full text-[10px] sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#B08B5E] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              Join Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-start text-center px-4 sm:px-6 pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#B08B5E]/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#B08B5E]/15 border border-[#B08B5E]/30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7B4F1D]">The Future of Campus Recruitment</p>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter max-w-5xl">
          Empowering <span className="text-[#B08B5E]">Careers</span>, <br /> 
          Simplifying <span className="text-[#B08B5E]">Hiring</span>.
        </h1>

        <p className="text-base sm:text-xl text-[#4A2C14]/70 mb-12 max-w-2xl font-medium leading-relaxed">
          A unified ecosystem connecting students, recruiters, and administrators for a seamless, data-driven placement journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-row gap-3 w-full sm:w-auto justify-center items-center">
          <Link
            to="/login"
            className="flex-1 sm:flex-none px-3 sm:px-10 py-4 sm:py-5 bg-[#5A371F] text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl hover:bg-[#4A2C14] hover:-translate-y-1 transition-all text-center"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="flex-1 sm:flex-none px-3 sm:px-10 py-4 sm:py-5 border-2 border-[#5A371F] text-[#5A371F] rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-[#5A371F] hover:text-white transition-all text-center"
          >
            How It Works
          </a>
        </div>
      </main>

      {/* Trust Ribbon - Updated from bg-white to bg-[#FFFBF5] */}
      <section className="bg-[#FFFBF5] py-10 border-y border-[#EADCC8]">
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
      <section id="features" className="py-12 sm:py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#5A371F]">Tailored For Success</h2>
          <div className="h-1.5 w-16 bg-[#B08B5E] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              role: 'Students', 
              icon: '👨🏻‍🎓', 
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
            /* Card Color Updated from bg-white to bg-[#FDF8F1] */
            <div key={i} className="bg-[#FDF8F1] p-10 rounded-[3rem] shadow-sm border border-[#EADCC8] hover:shadow-2xl transition-all group hover:-translate-y-2 duration-500">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-black text-[#5A371F] mb-4 uppercase tracking-tighter">For {item.role}</h3>
              <p className="text-sm text-[#4A2C14]/60 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      {/* <section className=" py-24 px-6 text-white overflow-hidden relative">
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
                <img 
                  src="/image.png" 
                  alt="Development Team" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#B08B5E]"
                />
                <div>
                  <p className="font-black text-sm uppercase">Development Team</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Avani Enterprises</p>
                </div>
             </div>
          </div>
        </div>
      </section> */}
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#F8EFE2] text-[#4A2C14] overflow-hidden relative">

  {/* Background Big Text */}
  <div className="absolute right-0 bottom-0 
                  text-[8rem] sm:text-[12rem] lg:text-[20rem] 
                  opacity-5 font-black leading-none select-none 
                  translate-y-1/3 sm:translate-y-1/2 
                  translate-x-1/4 text-[#4A2C14]">
    AVANI
  </div>

  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
    
    {/* Left Content */}
    <div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8 leading-tight tracking-tight">
        Built on the Modern <br/>
        <span className="text-[#B08B5E]">MERN Tech-Stack</span>.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {[
          { t: 'Secure Access', d: 'Role-based authentication with JWT security.' },
          { t: 'Live Tracking', d: 'Real-time status updates for applications.' },
          { t: 'PDF Engine', d: 'Instant resume previews and downloads.' },
          { t: 'Analytics', d: 'Data visualization for placement trends.' }
        ].map((point, i) => (
          <div key={i}>
            <p className="text-[#B08B5E] font-black text-xs uppercase tracking-widest mb-1">
              {point.t}
            </p>
            <p className="text-sm sm:text-xs text-[#5A371F]/80 font-medium leading-relaxed">
              {point.d}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Quote Box */}
    <div className="bg-[#EADBC8]/50 p-6 sm:p-8 rounded-3xl sm:rounded-[3rem] 
                    border border-[#B08B5E]/20 backdrop-blur-sm">
      
      <p className="italic text-base sm:text-lg lg:text-xl font-medium text-[#5A371F]">
        "Our mission is to digitize the campus hiring experience, making it transparent, fast, and accessible for everyone involved."
      </p>

      <div className="mt-6 flex items-center gap-4">
        <img 
          src="/image.png" 
          alt="Development Team" 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#B08B5E]"
        />
        <div>
          <p className="font-black text-xs sm:text-sm uppercase text-[#4A2C14]">
            Development Team
          </p>
          <p className="text-[9px] sm:text-[10px] text-[#5A371F]/60 uppercase font-bold tracking-widest">
            Avani Enterprises
          </p>
        </div>
      </div>
    </div>

  </div>
</section>

      <Footer />
    </div>
  );
}