import React from "react";
import Navbar from "../layout/NavBar";
import HeroSectionImage from "../../assets/image-removebg 1.png";

const HeroSection = () => {
  return (
    <div className=" min-h-screen">
      <Navbar />

      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-20 pb-32 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-6">
              A Wealth of Experience To Heal And Help You.
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              We are always fully focused on helping your child and you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button className="bg-[#00A9FF] text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors">
                Learn More
              </button>
              <button className="bg-white text-blue-500 px-8 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors">
                Make an Appointment
              </button>
            </div>
          </div>

          {/* Right Column - Circle Design */}
          <div className="relative flex justify-center lg:block">
            <div className="relative transform lg:translate-y-[30px] lg:translate-x-[196px]">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-[20px] sm:border-[30px] lg:border-[40px] border-[#A0E9FF] flex items-center justify-center">
                <img
                  src={HeroSectionImage}
                  alt="Hero Section"
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
