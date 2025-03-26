import React, { useState, useEffect } from "react";
import {
  Home,
  Hospital,
  DollarSign,
  Contact,
  LogIn,
  User,
  LogOut,
  Calendar,
  MessageSquare,
} from "lucide-react";
import MedConnectLogo from "../../assets/MedConnect_Logo3-removebg.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Notifications from "../common/Notification";

import {
  handleClearAllNotifications,
  handleGetUserNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Get notifications from Redux store
  const { notifications } = useSelector((state) => state?.notifications);

  const { isAuthenticated } = useSelector((state) => state?.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(handleGetUserNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      setIsMenuOpen(false);
    }
  };

  const markAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    if (notificationId) {
      dispatch(handleMarkNotificationAsRead(notificationId));
    } else {
      console.error("Invalid notification or user ID");
    }
  };
  const markAllAsRead = () => {
    dispatch(handleMarkAllNotificationsAsRead());
  };

  const clearNotifications = () => {
    dispatch(handleClearAllNotifications());
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navigateToChat = () => {
    navigate("/chat/users");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsNavbarVisible(
        prevScrollPos > currentScrollPos || currentScrollPos <= 0
      );
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
    { href: "/medicalTests", label: "Medical Tests", icon: DollarSign },
    { href: "/book-appointment", label: "Book Appointment", icon: Calendar },
  ];

  const unreadCount =
    notifications?.filter((notification) => !notification.read)?.length || 0;

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#CDF5FD] transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={MedConnectLogo}
              alt="MedConnect Logo"
              className="w-36 h-42"
            />
          </div>

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

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Notifications
                  notifications={notifications}
                  isNotificationsOpen={isNotificationsOpen}
                  toggleNotifications={toggleNotifications}
                  unreadCount={unreadCount}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  clearNotifications={clearNotifications}
                />
                <button
                  onClick={navigateToChat}
                  className="flex items-center text-blue-500 hover:text-blue-600 text-lg font-medium transition"
                >
                  <MessageSquare className="mr-1" size={20} />
                  Messages
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center text-blue-500 hover:text-blue-600 text-lg font-medium transition"
                >
                  <User className="mr-1" size={20} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-2 rounded-full hover:shadow-xl transition flex items-center text-lg"
                >
                  Logout <LogOut className="ml-2" size={20} />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="flex items-center text-blue-500 hover:text-blue-600 text-lg font-medium transition"
                >
                  <User className="mr-1" size={20} />
                  SignUp
                </a>
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-2 rounded-full hover:shadow-xl transition flex items-center text-lg"
                >
                  Login <LogIn className="ml-2" size={20} />
                </a>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <Notifications
                  notifications={notifications}
                  isNotificationsOpen={isNotificationsOpen}
                  toggleNotifications={toggleNotifications}
                  unreadCount={unreadCount}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  clearNotifications={clearNotifications}
                />
                <button
                  onClick={navigateToChat}
                  className="p-2 rounded-md hover:bg-blue-100 transition"
                >
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </button>
              </>
            )}
            <button
              className="p-2 rounded-md hover:bg-blue-100 transition"
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
        </div>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden absolute left-0 right-0 top-full bg-[#CDF5FD] shadow-lg flex-col w-full py-4 px-4 mt-2 space-y-2 z-40`}
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
                <button
                  onClick={navigateToChat}
                  className="flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-lg font-medium transition w-full"
                >
                  <MessageSquare className="mr-3" size={20} />
                  Messages
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-lg font-medium transition w-full"
                >
                  <User className="mr-3" size={20} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition flex items-center justify-center text-lg w-full"
                >
                  Logout <LogOut className="ml-2" size={20} />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md text-lg font-medium transition"
                >
                  <User className="mr-3" size={20} />
                  SignUp
                </a>
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition flex items-center justify-center text-lg"
                >
                  Login <LogIn className="ml-2" size={20} />
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