import { ArrowRight, Home } from "lucide-react";
import Footer from "../../component/layout/Footer";
import Navbar from "../../component/layout/NavBar";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! The page you're looking for is on vacation 🏖️
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Don't worry! Even web pages need a break sometimes. Let's help you
            find what you're looking for.
          </p>

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
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default NotFoundPage;
