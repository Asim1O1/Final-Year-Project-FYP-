import {
  Calendar,
  Home,
  Hospital,
  LogIn,
  LogOut,
  Menu as MenuIcon,
  MessageSquare,
  TestTubeIcon,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MedConnectLogo from "../../assets/MedConnect_Logo3-removebg.png";
import { logoutUser } from "../../features/auth/authSlice";
import Notifications from "../common/Notification";

import { FaHandHoldingMedical } from "react-icons/fa";
import { clearUnreadCountForChat } from "../../features/messages/messageSlice";
import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Get auth and notification states from Redux
  const { isAuthenticated } = useSelector((state) => state?.auth);
  const { notifications } = useSelector((state) => state?.notifications);

  const isOnChatPage = () => {
    return location.pathname.includes("/chat");
  };

  const unreadChatCount = useSelector(
    (state) => state?.messageSlice?.unreadCount
  );

  console.log("Unread Chat Count:", unreadChatCount);

  // Calculate total unread messages
  const totalUnreadCount = unreadChatCount.reduce(
    (total, chat) => total + chat.count,
    0
  );

  console.log("Total Unread Count:", totalUnreadCount);

  // Calculate unread notifications
  const unreadCount =
    notifications?.filter((notification) => !notification.read)?.length || 0;

  // Navigation links configuration
  const NavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/hospitals", label: "Hospitals", icon: Hospital },
    { href: "/medicalTests", label: "Medical Tests", icon: TestTubeIcon },
    { href: "/book-appointment", label: "Book Appointment", icon: Calendar },
    { href: "/campaigns", label: "Campaigns", icon: FaHandHoldingMedical },
  ];

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(handleGetNotifications());
    }
  }, [dispatch, isAuthenticated]);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsNavbarVisible(
        prevScrollPos > currentScrollPos || currentScrollPos <= 0 || isMenuOpen // Keep navbar visible when menu is open
      );
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, isMenuOpen]);

  // Clear unread message count when on chat page
  useEffect(() => {
    // If we're on a chat page, clear the unread count
    if (isOnChatPage() && totalUnreadCount > 0) {
      // Clear all unread counts for all chats
      unreadChatCount.forEach((chat) => {
        if (chat.count > 0) {
          dispatch(clearUnreadCountForChat(chat.chatId));
        }
      });
    }
  }, [location.pathname, unreadChatCount, dispatch]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsNotificationsOpen(false); // Close notifications when opening menu
    }
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      setIsMenuOpen(false); // Close menu when opening notifications
    }
  };

  // Handle notification actions
  const markAsRead = (notificationId) => {
    if (notificationId) {
      dispatch(handleMarkNotificationAsRead(notificationId));
    }
  };

  const markAllAsRead = () => {
    dispatch(handleMarkAllNotificationsAsRead());
  };

  const clearNotifications = () => {
    dispatch(handleClearAllNotifications());
  };

  // Handle user actions
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navigateToChat = () => {
    // Clear unread count for all chats when navigating to chat
    if (unreadChatCount.length > 0) {
      unreadChatCount.forEach((chat) => {
        if (chat.count > 0) {
          dispatch(clearUnreadCountForChat(chat.chatId));
        }
      });
    }
    navigate("/chat/users");
    setIsMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-100 shadow-sm transition-all duration-500 ease-in-out ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={MedConnectLogo || "/placeholder.svg"}
                alt="MedConnect Logo"
                className="w-36 h-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center text-base font-medium ${
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } transition-colors duration-300 group py-2 relative`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <link.icon
                  className={`mr-2 ${
                    isActive(link.href)
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600"
                  } transition-colors duration-300`}
                  size={18}
                  aria-hidden="true"
                />
                <span className="relative">
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 transition-transform duration-300 origin-left rounded-full ${
                      isActive(link.href)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  ></span>
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth/User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 bg-gray-50 py-1 px-2 rounded-full">
                  <Notifications
                    notifications={notifications}
                    isNotificationsOpen={isNotificationsOpen}
                    toggleNotifications={toggleNotifications}
                    unreadCount={unreadCount}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                    clearNotifications={clearNotifications}
                    className="relative"
                  />

                  <div className="h-4 w-px bg-gray-200"></div>

                  <button
                    onClick={navigateToChat}
                    className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                    aria-label="Chat"
                  >
                    <MessageSquare size={20} />
                    {!isOnChatPage() && totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                      </span>
                    )}
                  </button>
                </div>

                <Link
                  to="/profile"
                  className={`flex items-center ${
                    isActive("/profile")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  } text-base font-medium transition-colors duration-300 group py-2 relative`}
                  aria-current={isActive("/profile") ? "page" : undefined}
                >
                  <User
                    className={`mr-2 ${
                      isActive("/profile")
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    } transition-colors duration-300`}
                    size={18}
                    aria-hidden="true"
                  />
                  <span className="relative">
                    Profile
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 transition-transform duration-300 origin-left rounded-full ${
                        isActive("/profile")
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      aria-hidden="true"
                    ></span>
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-300 flex items-center text-sm font-medium"
                  aria-label="Log out of your account"
                >
                  Logout <LogOut className="ml-1.5" size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`flex items-center ${
                    isActive("/register")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  } text-base font-medium transition-colors duration-300 group py-2 relative`}
                  aria-current={isActive("/register") ? "page" : undefined}
                >
                  <User
                    className={`mr-2 ${
                      isActive("/register")
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    } transition-colors duration-300`}
                    size={18}
                    aria-hidden="true"
                  />
                  <span className="relative">
                    Sign Up
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 transition-transform duration-300 origin-left rounded-full ${
                        isActive("/register")
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      aria-hidden="true"
                    ></span>
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center text-sm font-medium"
                  aria-label="Log in to your account"
                >
                  Login <LogIn className="ml-1.5" size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <div className="flex items-center space-x-2 bg-gray-50 py-1 px-2 rounded-full">
                  <Notifications
                    notifications={notifications}
                    isNotificationsOpen={isNotificationsOpen}
                    toggleNotifications={toggleNotifications}
                    unreadCount={unreadCount}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                    clearNotifications={clearNotifications}
                  />

                  <div className="h-4 w-px bg-gray-200"></div>

                  <button
                    onClick={navigateToChat}
                    className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                    aria-label="Chat"
                  >
                    <MessageSquare size={20} />
                    {!isOnChatPage() && totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}

            <button
              className="p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved Animation and Structure */}
      <div
        className={`md:hidden fixed inset-0 top-[calc(3.25rem+1px)] bg-black/5 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      <div
        className={`md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-lg flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out z-40 ${
          isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-label="Mobile navigation menu"
        role="navigation"
      >
        <div className="px-5 py-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center text-base font-medium px-4 py-2.5 rounded-lg ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              } transition-all duration-200`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              <link.icon
                className={
                  isActive(link.href)
                    ? "mr-3.5 text-blue-500"
                    : "mr-3.5 text-gray-500"
                }
                size={18}
                aria-hidden="true"
              />
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-2.5 rounded-lg text-base font-medium w-full ${
                    isActive("/profile")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  } transition-all duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive("/profile") ? "page" : undefined}
                >
                  <User
                    className={
                      isActive("/profile")
                        ? "mr-3.5 text-blue-500"
                        : "mr-3.5 text-gray-500"
                    }
                    size={18}
                    aria-hidden="true"
                  />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center text-base font-medium w-full mt-2"
                  aria-label="Log out of your account"
                >
                  Logout <LogOut className="ml-2" size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`flex items-center px-4 py-2.5 rounded-lg text-base font-medium w-full ${
                    isActive("/register")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  } transition-all duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive("/register") ? "page" : undefined}
                >
                  <User
                    className={
                      isActive("/register")
                        ? "mr-3.5 text-blue-500"
                        : "mr-3.5 text-gray-500"
                    }
                    size={18}
                    aria-hidden="true"
                  />
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 flex items-center justify-center text-base font-medium w-full mt-2"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Log in to your account"
                >
                  Login <LogIn className="ml-2" size={18} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Healthcare Emergency Contact */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Need immediate help?
                </p>
                <a
                  href="tel:+9779800000000"
                  className="text-blue-800 text-sm font-bold mt-1 block"
                >
                  +977 9800000000
                </a>
                <p className="text-xs text-blue-600 mt-1">
                  Available 24/7 for medical emergencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
