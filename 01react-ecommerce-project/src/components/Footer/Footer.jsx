import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-black via-zinc-900 to-black text-white py-14  overflow-hidden">
      {/* Animated glow */}
      <div className="absolute inset-0 opacity-20 animate-pulse bg-gradient-to-r from-amber-500 via-transparent to-blue-500"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center space-y-6">
        {/* Brand */}
        <h2 className="text-4xl sm:text-3xl xs:text-2xl font-extrabold tracking-wide animate-bounce">
          Zain’s Fashion Store
        </h2>

        <p className="text-gray-400 text-sm sm:text-xs animate-fade-in">
          Style. Confidence. Quality. Delivered with passion.
        </p>

        {/* Animated Divider */}
        <div className="flex justify-center">
          <span className="w-24 sm:w-16 h-1 bg-amber-500 rounded-full animate-ping"></span>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 text-3xl sm:text-2xl xs:text-xl mt-6">
          <a
            href="https://www.instagram.com/zain_ul_abedin_7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:scale-125 hover:rotate-12 transition-all duration-300"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.linkedin.com/in/zainulabedin356"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:scale-125 hover:-rotate-12 transition-all duration-300"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-[10px] xs:text-[8px] text-gray-500 mt-6">
          © 2025 Zain Ul Abedin • Designed with ❤️ using React & Tailwind
        </p>
      </div>
    </footer>
  );
}

export default Footer;
