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

  // ✅ Email Validation (Strong)
  const isValidEmail = (email) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/i;
    return regex.test(email);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();

    // 🔴 Validate email
    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address");
    }

    // 🔴 Password match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    // 🔴 Password length
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        `/auth/register`,
        {
          name: formData.name.trim(),
          email: email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const { token, role, user } = res.data;

      // ✅ Login via context
      login({
        token,
        role,
        name: user?.name || formData.name,
      });

      navigate("/student/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8EFE2] font-[Montserrat] p-4 lg:p-8">
      
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[650px]">

        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#B08B5E] to-[#7B4F1D] text-white flex-col justify-center p-12">
          <img
            src={"/image.png"}
            alt="Avani Logo"
            className="h-20 w-20 mb-6 border-4 border-[#F8EFE2] rounded-xl"
          />

          <h2 className="text-4xl font-extrabold uppercase mb-2">
            AVANI ENTERPRISES
          </h2>

          <div className="w-20 h-1.5 bg-[#F8EFE2] mb-6 rounded-full"></div>

          <h3 className="text-2xl font-semibold mb-4 text-[#F8EFE2]">
            Empowering Your Future
          </h3>

          <p className="text-base opacity-90 mb-8">
            Join thousands of students gaining industry-ready skills and
            career opportunities.
          </p>

          <ul className="space-y-4">
            <li>✔ Personalized Dashboard</li>
            <li>✔ Expert Mentorship</li>
            <li>✔ Career Growth Opportunities</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-[#F8EFE2] flex flex-col justify-center items-center p-8">
          
          <div className="w-full max-w-sm">
            
            <h2 className="text-3xl font-extrabold text-[#7B4F1D] mb-1">
              Create Account
            </h2>

            <p className="text-[#B08B5E] mb-6">
              Step into your professional journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="block mb-1 text-xs font-bold text-[#7B4F1D]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B08B5E] focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="Rahul Sharma"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-1 text-xs font-bold text-[#7B4F1D]">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B08B5E] focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="name@gmail.com"
                />
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-1 text-xs font-bold text-[#7B4F1D]">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B08B5E]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-bold text-[#7B4F1D]">
                    Confirm
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B08B5E]"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center font-semibold">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-3 rounded-xl shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B08B5E] hover:bg-[#7B4F1D]"
                }`}
              >
                {loading ? "Processing..." : "Register as Student"}
              </button>

              {/* LOGIN LINK */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-[#7B4F1D] hover:underline"
                >
                  Already registered? <b>Sign In</b>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
