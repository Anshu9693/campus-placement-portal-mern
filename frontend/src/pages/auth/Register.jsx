import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        `/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const { token, role, user } = res.data;
      
      // Login via AuthContext
      login({
        token,
        role,
        name: user?.name || formData.name,
      });

      navigate("/student/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8EFE2] font-[Montserrat] p-4 lg:p-8">
      
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[650px] lg:max-h-[850px]">

        {/* Left Branding Panel: Enhanced with more content */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#B08B5E] to-[#7B4F1D] text-white flex-col justify-center p-10 lg:p-16">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={"/image.png"}
              alt="Avani Logo"
              className="h-16 w-16 lg:h-20 lg:w-20 mb-6 border-4 border-[#F8EFE2] rounded-xl self-center md:self-start"
            />
            <h2 className="text-2xl lg:text-4xl font-extrabold tracking-wider text-center md:text-left uppercase mb-2">
              AVANI ENTERPRISES
            </h2>
            <div className="w-20 h-1.5 bg-[#F8EFE2] mb-6 rounded-full opacity-80"></div>
            
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-[#F8EFE2]">
              Empowering Your Future
            </h3>
            
            <p className="text-sm lg:text-base font-light leading-relaxed mb-8 opacity-90">
              Join thousands of students gaining industry-ready skills and career opportunities. 
              Our portal provides seamless access to resources, certifications, and mentorship.
            </p>

            {/* Feature List to fill space and add value */}
            <ul className="space-y-4 w-full">
              {[
                { title: "Personalized Dashboard", desc: "Track your progress in real-time." },
                { title: "Expert Mentorship", desc: "Connect with industry professionals." },
                { title: "Career Growth", desc: "Exclusive job and internship listings." }
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="mt-1 bg-[#F8EFE2] text-[#7B4F1D] rounded-full p-1 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm lg:text-base">{item.title}</h4>
                    <p className="text-xs lg:text-sm opacity-80">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Register Panel */}
        <div className="w-full md:w-1/2 bg-[#F8EFE2] flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-sm">
            <header className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-[#7B4F1D]">
                Create Account
              </h2>
              <p className="text-[#B08B5E] mt-1 font-medium">
                Step into your professional journey.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm"
                  placeholder="name@university.com"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
                    Confirm
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-xs text-center font-semibold">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-3 mt-2 rounded-xl shadow-md transition-all active:scale-[0.98] ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#B08B5E] hover:bg-[#7B4F1D]"
                }`}
              >
                {loading ? "Processing..." : "Register as Student"}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  className="text-sm text-[#7B4F1D] opacity-80 hover:opacity-100 hover:underline transition-all"
                  onClick={() => navigate("/login")}
                >
                  Already registered? <span className="font-bold">Sign In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}