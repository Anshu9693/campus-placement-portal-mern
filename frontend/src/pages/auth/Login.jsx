// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import axiosInstance from "../../services/axiosInstance";


// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // Validate inputs
//     if (!formData.email || !formData.password) {
//       setError("Email and password are required");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("Login attempt with email:", formData.email);
//       const res = await axiosInstance.post(
//         `/auth/login`,
//         formData,
//         { withCredentials: true }
//       );

//       const { token, role, user } = res.data;

//       // Login via AuthContext
//       login({
//         token,
//         role,
//         name: user?.name || formData.email,
//       });

//       // Role-based redirection
//       const routes = {
//         admin: "/admin/dashboard",
//         student: "/student/dashboard",
//         recruiter: "/recruiter/dashboard",
//       };

//       navigate(routes[role] || "/");
      
//     } catch (err) {
//       console.error("Login error:", err.response?.data);
//       const errorMsg = err.response?.data?.message || "Invalid credentials. Please try again.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8EFE2] font-[Montserrat] p-4 lg:p-8">
      
//       {/* Main Container */}
//       <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px] lg:max-h-[800px]">

//         {/* Left Branding Panel */}
//         <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#B08B5E] to-[#7B4F1D] text-white flex-col justify-center p-10 lg:p-16">
//           <img
//             src={"/image.png"}
//             alt="Avani Logo"
//             className="h-16 w-16 lg:h-20 lg:w-20 mb-6 border-4 border-[#F8EFE2] rounded-xl"
//           />
//           <h2 className="text-2xl lg:text-4xl font-extrabold tracking-wider uppercase mb-2">
//             AVANI ENTERPRISES
//           </h2>
//           <div className="w-16 h-1 bg-[#F8EFE2] mb-6 rounded-full opacity-70"></div>
          
//           <p className="text-lg font-light mb-8 opacity-90">
//             Placement Management System
//           </p>

//           <div className="space-y-4 w-full max-w-xs">
//             {[
//               "Student Drive Applications",
//               "Recruiter Candidate Management",
//               "Admin Controlled Placement"
//             ].map((text, i) => (
//               <div key={i} className="flex items-center space-x-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/10">
//                 <div className="h-2 w-2 bg-[#F8EFE2] rounded-full"></div>
//                 <span className="text-sm font-medium">{text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Login Panel */}
//         <div className="w-full md:w-1/2 bg-[#F8EFE2] flex flex-col justify-center items-center p-8 lg:p-12">
//           <div className="w-full max-w-sm">
//             <header className="mb-8 text-center md:text-left">
//               <h2 className="text-3xl font-extrabold text-[#7B4F1D] mb-2">
//                 Welcome Back
//               </h2>
//               <p className="text-[#B08B5E] font-medium">
//                 Log in to access your portal.
//               </p>
//             </header>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
//                   placeholder="name@example.com"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>

//               {error && (
//                 <div className="p-3 rounded-lg bg-red-50 border border-red-200">
//                   <p className="text-red-600 text-xs text-center font-semibold italic">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full text-white font-bold py-3 mt-2 rounded-xl shadow-md transition-all active:scale-[0.98] ${
//                   loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#B08B5E] hover:bg-[#7B4F1D]"
//                 }`}
//               >
//                 {loading ? "Verifying..." : "Sign In"}
//               </button>

//               <div className="text-center pt-6">
//                 <button
//                   type="button"
//                   className="text-sm text-[#7B4F1D] opacity-80 hover:opacity-100 hover:underline transition-all"
//                   onClick={() => navigate("/register")}
//                 >
//                   New to the portal? <span className="font-bold">Register as Student</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import axiosInstance from "../../services/axiosInstance";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!formData.email || !formData.password) {
//       setError("Email and password are required");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("Login attempt with email:", formData.email);
//       const res = await axiosInstance.post(
//         `/auth/login`,
//         formData,
//         { withCredentials: true }
//       );

//       const { token, role, user } = res.data;

//       login({
//         token,
//         role,
//         name: user?.name || formData.email,
//       });

//       const routes = {
//         admin: "/admin/dashboard",
//         student: "/student/dashboard",
//         recruiter: "/recruiter/dashboard",
//       };

//       navigate(routes[role] || "/");
      
//     } catch (err) {
//       console.error("Login error:", err.response?.data);
//       const errorMsg =
//         err.response?.data?.message ||
//         "Invalid credentials. Please try again.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8EFE2] font-[Montserrat] p-4 lg:p-8">
      
//       {/* Main Container */}
//       <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#F8EFE2] md:bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px] lg:max-h-[800px]">

//         {/* Left Branding Panel */}
//         <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#B08B5E] to-[#7B4F1D] text-white flex-col justify-center p-10 lg:p-16">
//           <img
//             src={"/image.png"}
//             alt="Avani Logo"
//             className="h-16 w-16 lg:h-20 lg:w-20 mb-6 border-4 border-[#F8EFE2] rounded-xl"
//           />
//           <h2 className="text-2xl lg:text-4xl font-extrabold tracking-wider uppercase mb-2">
//             AVANI ENTERPRISES
//           </h2>
//           <div className="w-16 h-1 bg-[#F8EFE2] mb-6 rounded-full opacity-70"></div>
          
//           <p className="text-lg font-light mb-8 opacity-90">
//             Placement Management System
//           </p>

//           <div className="space-y-4 w-full max-w-xs">
//             {[
//               "Student Drive Applications",
//               "Recruiter Candidate Management",
//               "Admin Controlled Placement"
//             ].map((text, i) => (
//               <div key={i} className="flex items-center space-x-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/10">
//                 <div className="h-2 w-2 bg-[#F8EFE2] rounded-full"></div>
//                 <span className="text-sm font-medium">{text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Login Panel */}
//         <div className="w-full md:w-1/2 bg-[#F8EFE2] flex flex-col justify-center items-center p-8 lg:p-12">
//           <div className="w-full max-w-sm">
//             <header className="mb-8 text-center md:text-left">
//               <img
//                 src="/image.png"
//                 alt="Avani Logo"
//                 className="h-12 w-12 mx-auto md:mx-0 mb-4 border-2 border-[#B08B5E] rounded-full md:hidden"
//               />
//               <h2 className="text-3xl font-extrabold text-[#7B4F1D] mb-2">
//                 Welcome Back
//               </h2>
//               <p className="text-[#B08B5E] font-medium">
//                 Log in to access your portal.
//               </p>
//             </header>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
//                   placeholder="name@example.com"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>

//               {error && (
//                 <div className="p-3 rounded-lg bg-red-50 border border-red-200">
//                   <p className="text-red-600 text-xs text-center font-semibold italic">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full text-white font-bold py-3 mt-2 rounded-xl shadow-md transition-all active:scale-[0.98] ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-[#B08B5E] hover:bg-[#7B4F1D]"
//                 }`}
//               >
//                 {loading ? "Verifying..." : "Sign In"}
//               </button>

//               <div className="text-center pt-6">
//                 <button
//                   type="button"
//                   className="text-sm text-[#7B4F1D] opacity-80 hover:opacity-100 hover:underline transition-all"
//                   onClick={() => navigate("/register")}
//                 >
//                   New to the portal?{" "}
//                   <span className="font-bold">
//                     Register as Student
//                   </span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (loading) return;

    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/auth/login`,
        formData,
        { withCredentials: true }
      );

      const { token, role, user } = res.data;

      login({
        token,
        role,
        name: user?.name || formData.email,
      });

      const routes = {
        admin: "/admin/dashboard",
        student: "/student/dashboard",
        recruiter: "/recruiter/dashboard",
      };

      navigate(routes[role] || "/");

    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Invalid credentials. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8EFE2] font-[Montserrat] p-4 lg:p-8">
      
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#F8EFE2] md:bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px] lg:max-h-[800px]">

        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#B08B5E] to-[#7B4F1D] text-white flex-col justify-center p-10 lg:p-16">
          <img
            src={"/image.png"}
            alt="Avani Logo"
            className="h-16 w-16 lg:h-20 lg:w-20 mb-6 border-4 border-[#F8EFE2] rounded-xl"
          />
          <h2 className="text-2xl lg:text-4xl font-extrabold tracking-wider uppercase mb-2">
            AVANI ENTERPRISES
          </h2>
          <div className="w-16 h-1 bg-[#F8EFE2] mb-6 rounded-full opacity-70"></div>
          
          <p className="text-lg font-light mb-8 opacity-90">
            Placement Management System
          </p>
        </div>

        {/* Right Login Panel */}
        <div className="w-full md:w-1/2 bg-[#F8EFE2] flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="w-full max-w-sm">
            <header className="mb-8 text-center md:text-left">
              <img
                src="/image.png"
                alt="Avani Logo"
                className="h-12 w-12 mx-auto md:mx-0 mb-4 border-2 border-[#B08B5E] rounded-full md:hidden"
              />
              <h2 className="text-3xl font-extrabold text-[#7B4F1D] mb-2">
                Welcome Back
              </h2>
              <p className="text-[#B08B5E] font-medium">
                Log in to access your portal.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs uppercase tracking-wider font-bold text-[#7B4F1D]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#B08B5E] focus:outline-none focus:ring-2 focus:ring-[#B08B5E] bg-white shadow-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Error Only When Not Loading */}
              {!loading && error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-xs text-center font-semibold italic">
                    {error}
                  </p>
                </div>
              )}

              {/* Button With Circular Loader */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 mt-2 rounded-xl shadow-md transition-all active:scale-[0.98] bg-[#B08B5E] hover:bg-[#7B4F1D] disabled:bg-gray-400"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "Verifying..." : "Sign In"}
              </button>

              <div className="text-center pt-6">
                <button
                  type="button"
                  className="text-sm text-[#7B4F1D] opacity-80 hover:opacity-100 hover:underline transition-all"
                  onClick={() => navigate("/register")}
                  disabled={loading}
                >
                  New to the portal?{" "}
                  <span className="font-bold">
                    Register as Student
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}