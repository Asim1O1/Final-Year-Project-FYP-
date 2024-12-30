import React, { useState } from "react";
import MedConnectLogo from "../../assets/MedConnect_Logo3-removebg.png";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative">
      <div className="container mx-auto px-4 lg:px-36 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src={MedConnectLogo}
              alt="MedConnect Logo"
              className="w-36 h-42"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-16 ">
            <a href="#" className="text-gray-600 hover:text-gray-900 ">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Product
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>

          {/* Desktop Buttons Section */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-600">
              SignUp
            </a>
            <a
              href="#"
              className="bg-[#00A9FF] text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              Login
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden absolute left-0 right-0 top-full bg-white shadow-lg flex-col w-full py-4 px-4 mt-2`}
        >
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 py-2">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 py-2">
              Product
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 py-2">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 py-2">
              Contact
            </a>
            <div className="border-t border-gray-200 pt-4">
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600 block py-2"
              >
                SignUp
              </a>
              <a
                href="#"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center mt-2"
              >
                Login
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
