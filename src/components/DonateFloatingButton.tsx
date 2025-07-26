import React from "react";

const DonateFloatingButton = () => {
  return (
    <button
      className="fixed bottom-20 right-10 md:right-14 z-[1000]
       bg-gradient-to-r from-green-700 to-cyan-400 text-white border-none rounded-full 
       px-8 py-4 text-[1.2rem] font-bold shadow-lg cursor-pointer transition-transform duration-200 
       hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="تبرع الآن"
    >
      تبرع الآن
    </button>
  );
};

export default DonateFloatingButton; 