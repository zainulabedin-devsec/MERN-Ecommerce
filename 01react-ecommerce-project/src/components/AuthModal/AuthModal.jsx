import React, { useEffect, useState } from "react";
import { registerUser, loginUser } from "../../api/authApi";

function AuthModal({ setShowAuth, authMode, setAuthMode, onLogin }) {
  const [animate, setAnimate] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnimate(true);
  }, []);

  const closeModal = () => {
    setAnimate(false);

    setTimeout(() => {
      setShowAuth(false);
    }, 300);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLogin(data.user);

        closeModal();
      } else {
        const data = await registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });

        alert("Account created successfully! Please login.");

        setAuthMode("login");

        setFormData({
          firstName: "",
          lastName: "",
          email: formData.email,
          password: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl p-4 sm:p-8 w-full sm:w-96 z-50 transform transition-all duration-300 ${
          animate
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {authMode === "login" ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Signup fields */}
          {authMode === "signup" && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border p-3 mb-3 rounded"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border p-3 mb-3 rounded"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 mb-3 rounded"
              />
            </>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-3 mb-3 rounded"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border p-3 mb-4 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Please wait..."
              : authMode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {authMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => {
                  setError("");
                  setAuthMode("signup");
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => {
                  setError("");
                  setAuthMode("login");
                }}
              >
                Login
              </span>
            </>
          )}
        </p>

        <button
          onClick={closeModal}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </section>
  );
}

export default AuthModal;