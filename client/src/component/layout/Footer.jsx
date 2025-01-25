import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company Info</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                We are hiring
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookies Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Disclaimer
              </a>
            </li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Business Marketing
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                User Analytics
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Live Chat
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Unlimited Support
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                iOS & Android
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Watch a Demo
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Customers
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                API
              </a>
            </li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-400 text-sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              (480) 555-0103
            </li>
            <li className="flex items-center text-gray-400 text-sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              4517 Washington Ave, KY 39495
            </li>
            <li className="flex items-center text-gray-400 text-sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contact@company.com
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8"></div>

      {/* Social Media */}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-gray-400 text-sm">© 2025 Your Company. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
