import React from "react";
import { Search, Home, Phone, LogIn, ArrowRight } from "lucide-react";
import Footer from "../../component/layout/Footer";
import Navbar from "../../component/layout/NavBar";

const NotFoundPage = () => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Image
          <div className="mb-8">
            <img
              src="/api/placeholder/400/300"
              alt="404 Illustration"
              className="mx-auto"
            />
          </div> */}

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! The page you're looking for is on vacation 🏖️
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Don't worry! Even web pages need a break sometimes. Let's help you
            find what you're looking for.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search MedConnect..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <a
              href="/"
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <Home className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <span className="font-medium">Return Home</span>
            </a>
            <a
              href="/hospitals"
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <ArrowRight className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <span className="font-medium">Available Hospitals</span>
            </a>
            <a
              href="/dashboard"
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <LogIn className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <span className="font-medium">Patient Dashboard</span>
            </a>
            <a
              href="/contact"
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <Phone className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <span className="font-medium">Contact Support</span>
            </a>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default NotFoundPage;
