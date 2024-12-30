import React from "react";
import Navbar from "../layout/NavBar";
import HeroSectionImage from "../../assets/image-removebg 1.png";

const HeroSection = () => {
  return (
    <div className="bg-[#CDF5FD] min-h-screen">
      <Navbar />

      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-20 pb-32 max-w-screen-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-1 lg:ml-[-150px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-6">
              A Wealth of Experience To Heal And Help You.
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              We are always fully focused on helping your child and you
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#00A9FF] text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors">
                Learn More
              </button>
              <button className="bg-white text-blue-500 px-8 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors">
                Make an Appointment
              </button>
            </div>
          </div>

          {/* Right Column - Circle Design */}
          <div className="relative hidden lg:block lg:col-span-1 flex justify-center">
            <div className="relative transform translate-y-[30px] translate-x-[196px]">
              {/* Move the circle design upward with -top-16 and inward with translate-x */}
            
              <div className="w-96 h-96 rounded-full border-[40px] border-[#A0E9FF]">
              <img
                src={HeroSectionImage}
                alt="Hero Section"
                className="w-80 h-80 object-contain"
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
