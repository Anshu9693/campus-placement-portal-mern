import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="px-6 py-6 bg-[#E8E1D6]">
      <footer className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-[#5A371F] to-[#7B4F1D] text-[#F8EFE2] shadow-2xl">
        <div className="px-8 py-12">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src="/image.png"
                  alt="Logo"
                  className="h-14 w-14 rounded-full border border-[#B08B5E] bg-white object-cover"
                />
                <h3 className="text-2xl font-bold tracking-wide">
                  AVANI ENTERPRISES
                </h3>
              </div>

              <p className="text-sm leading-6 text-[#F8EFE2]/90">
                A modern Placement Management Platform connecting
                students, recruiters, and administrators for
                seamless campus hiring.
              </p>

              <div className="text-sm text-[#F8EFE2]/80">
                <p>📍 UNITECH Cyber Park</p>
                <p>Sector 39, Gurugram, Haryana 122003</p>
              </div>

              {/* Social Media Links */}
              <div className="flex gap-4 pt-3">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#F8EFE2] text-[#5A371F] rounded-full hover:scale-110 transition-transform duration-300"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#F8EFE2] text-[#5A371F] rounded-full hover:scale-110 transition-transform duration-300"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#F8EFE2] text-[#5A371F] rounded-full hover:scale-110 transition-transform duration-300"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#F8EFE2] text-[#5A371F] rounded-full hover:scale-110 transition-transform duration-300"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>

            {/* Middle Section */}
            <div className="space-y-5">
              <h3 className="text-3xl font-bold">
                Placement Portal
              </h3>
              <div className="h-1 w-20 bg-[#F8EFE2] rounded-full" />

              <ul className="space-y-3 text-lg text-[#F8EFE2]/90">
                <li>• Student Registration & Profiles</li>
                <li>• Drive Creation & Management</li>
                <li>• Application Tracking</li>
                <li>• Recruiter Shortlisting</li>
                <li>• Placement Analytics</li>
              </ul>
            </div>

            {/* Map Section */}
            <div className="space-y-5">
              <h3 className="text-3xl font-bold">
                Visit Us
              </h3>
              <div className="h-1 w-20 bg-[#F8EFE2] rounded-full" />

              <div className="rounded-2xl overflow-hidden border border-[#B08B5E] shadow-lg">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.43024582009!2d77.0454047!3d28.443122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1858e4c4c5b3%3A0x7e8f7c47a5b3f9f0!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1700000000000"
                  className="w-full min-h-[200px]"
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="mt-10 border-t border-[#B08B5E]/40 pt-5 text-center text-sm text-[#F8EFE2]/80">
            © {new Date().getFullYear()} AVANI ENTERPRISES – Placement Management System.
            {" "} | Built with{" "}
            <span className="inline-block hover:scale-825 transition-transform duration-300 cursor-pointer">
              ❤️
            </span>{" "}
            by Anshu, Abhishek & Kaniska
          </div>

        </div>
      </footer>
    </div>
  );
}