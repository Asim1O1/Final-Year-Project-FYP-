import React, { useState, useEffect } from "react";
import {
  Home,
  Hospital,
  DollarSign,
  Contact,
  LogIn,
  User,
  LogOut,
} from "lucide-react";
import MedConnectLogo from "../../assets/MedConnect_Logo3-removebg.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { isAuthenticated } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      if (isScrollingUp || currentScrollPos <= 0) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const NavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/hospitals", label: "Hospitals", icon: Hospital },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/contact", label: "Contact", icon: Contact },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-transparent transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-12 py-4">
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
          <div className="hidden md:flex items-center space-x-8">
            {NavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center text-lg font-medium text-gray-600 hover:text-blue-500 transition group relative"
              >
                <link.icon
                  className="mr-2 text-gray-400 group-hover:text-blue-500 transition"
                  size={20}
                />
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Profile Icon */}
                <a
                  href="/profile"
                  className="flex items-center text-blue-500 hover:text-blue-600 text-lg font-medium transition"
                >
                  <User className="mr-1" size={20} />
                  Profile
                </a>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-2 rounded-full hover:shadow-xl transition flex items-center text-lg"
                >
                  Logout
                  <LogOut className="ml-2" size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Signup Button */}
                <a
                  href="/register"
                  className="flex items-center text-blue-500 hover:text-blue-600 text-lg font-medium transition"
                >
                  <User className="mr-1" size={20} />
                  SignUp
                </a>
                {/* Login Button */}
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-2 rounded-full hover:shadow-xl transition flex items-center text-lg"
                >
                  Login
                  <LogIn className="ml-2" size={20} />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
          } md:hidden absolute left-0 right-0 top-full bg-transparent backdrop-blur-md shadow-lg flex-col w-full py-4 px-4 mt-2 space-y-2`}
        >
          {NavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center text-lg font-medium px-4 py-2 rounded-md text-gray-600 hover:bg-blue-50 transition"
            >
              <link.icon className="mr-3 text-gray-400 transition" size={20} />
              {link.label}
            </a>
          ))}

          <div className="border-t border-gray-200 pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                {/* Profile Link */}
                <a
                  href="/profile"
                  className="flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-lg font-medium transition"
                >
                  <User className="mr-3" size={20} />
                  Profile
                </a>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition flex items-center justify-center text-lg w-full"
                >
                  Logout
                  <LogOut className="ml-2" size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Signup Link */}
                <a
                  href="/register"
                  className="flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-lg font-medium transition"
                >
                  <User className="mr-3" size={20} />
                  SignUp
                </a>
                {/* Login Button */}
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition flex items-center justify-center text-lg"
                >
                  Login
                  <LogIn className="ml-2" size={20} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
