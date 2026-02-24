import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="px-4 py-4 bg-[#E8E1D6]">
      <footer className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-br from-[#5A371F] to-[#7B4F1D] text-[#F8EFE2] shadow-xl">
        <div className="px-5 py-8 md:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Left Section - Branding */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/image.png"
                  alt="Logo"
                  className="h-10 w-10 rounded-full border border-[#B08B5E] bg-white object-cover"
                />
                <h3 className="text-xl font-bold tracking-tight">AVANI ENTERPRISES</h3>
              </div>
              
              <p className="text-sm leading-relaxed text-[#F8EFE2]/80 max-w-xs">
                A modern Placement Management Platform connecting students, recruiters, and admins.
              </p>

              <div className="text-xs text-[#F8EFE2]/70 space-y-1">
                <p>📍 UNITECH Cyber Park, Sector 39</p>
                <p>Gurugram, Haryana 122003</p>
              </div>

              {/* Compact Socials */}
              <div className="flex gap-3 pt-1">
                {[
                  { icon: <FaFacebookF />, url: "https://facebook.com" },
                  { icon: <FaLinkedinIn />, url: "https://linkedin.com" },
                  { icon: <FaInstagram />, url: "https://instagram.com" },
                  { icon: <FaTwitter />, url: "https://twitter.com" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#F8EFE2] text-[#5A371F] rounded-full hover:scale-110 transition-all text-sm"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Middle Section - Links (Grid layout on mobile to save space) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Placement Portal</h3>
                <div className="h-0.5 w-10 bg-[#B08B5E] mt-1" />
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-sm text-[#F8EFE2]/90">
                <li>• Student Profiles</li>
                <li>• Drive Management</li>
                <li>• Application Tracking</li>
                <li>• Recruiter Shortlisting</li>
                <li>• Placement Analytics</li>
              </ul>
            </div>

            {/* Right Section - Map */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Visit Us</h3>
                <div className="h-0.5 w-10 bg-[#B08B5E] mt-1" />
              </div>
              <div className="rounded-xl overflow-hidden border border-[#B08B5E]/30 shadow-inner">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.43024582009!2d77.0454047!3d28.443122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1858e4c4c5b3%3A0x7e8f7c47a5b3f9f0!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1700000000000"
                  className="w-full h-24 md:h-28"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="mt-8 border-t border-[#B08B5E]/30 pt-4 text-center text-[10px] md:text-xs text-[#F8EFE2]/60 uppercase tracking-widest">
            © {new Date().getFullYear()} AVANI ENTERPRISES 
            <span className="hidden md:inline"> | Built by Anshu, Abhishek & Kaniska</span>
            <div className="md:hidden mt-1">Anshu, Abhishek & Kaniska</div>
          </div>

        </div>
      </footer>
    </div>
  );
} 