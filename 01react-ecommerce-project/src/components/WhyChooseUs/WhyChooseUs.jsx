import React from "react";
import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";

function WhyChooseUs({ handleFeatureClick, clickedFeature }) {
  const features = [
    {
      icon: <FaShippingFast className="text-5xl text-white mb-4" />,
      title: "Fast Shipping",
      desc: "Quick delivery with reliable shipping partners.",
      bg: "bg-indigo-600",
    },
    {
      icon: <FaLock className="text-5xl text-white mb-4" />,
      title: "Secure Payments",
      desc: "Safe and trusted payment gateways.",
      bg: "bg-purple-600",
    },
    {
      icon: <FaHeadset className="text-5xl text-white mb-4" />,
      title: "24/7 Support",
      desc: "Support team available anytime to assist you.",
      bg: "bg-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-indigo-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 relative inline-block text-white">
          Why Choose Us
          <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-24 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature.title)}
              className={`
                ${feature.bg} p-8 rounded-2xl shadow-lg flex flex-col items-center text-center cursor-pointer
                transform transition duration-500 hover:scale-105 hover:shadow-2xl
                ${clickedFeature === feature.title ? "ring-4 ring-opacity-50" : "ring-4 ring-white"}
                animate-fadeIn
              `}
            >
              {feature.icon}
              <h3 className="text-xl md:text-2xl font-semibold mb-2 mt-2 text-white">
                {feature.title}
              </h3>
              <p className="text-white/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
