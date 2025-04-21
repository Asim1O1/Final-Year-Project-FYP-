import { useState, useEffect } from "react";
import {
  Home,
  Hospital,
  DollarSign,
  LogIn,
  User,
  LogOut,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";
import MedConnectLogo from "../../assets/MedConnect_Logo3-removebg.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Notifications from "../common/Notification";

import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";
import { Menu } from "@chakra-ui/react";
import { clearUnreadCountForChat } from "../../features/messages/messageSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadChatCount = useSelector(
    (state) => state?.messageSlice?.unreadCount
  );
  console.log("The unread chat count os", unreadChatCount);
  const totalUnreadCount = unreadChatCount.reduce(
    (total, chat) => total + chat.count,
    0
  );
  console.log("The total unread count is", totalUnreadCount);
  // Get notifications from Redux store
  const { notifications } = useSelector((state) => state?.notifications);

  const { isAuthenticated } = useSelector((state) => state?.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(handleGetNotifications());
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
    if (unreadChatCount.length > 0) {
      const chatIdToClear = unreadChatCount[0].chatId;
      dispatch(clearUnreadCountForChat(chatIdToClear));
    }

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
      className={`sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm transition-all duration-500 ease-in-out ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={MedConnectLogo || "/placeholder.svg"}
              alt="MedConnect Logo"
              className="w-36 h-auto"
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {NavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group py-2 relative"
              >
                <link.icon
                  className="mr-2 text-gray-500 group-hover:text-blue-600 transition-colors duration-300"
                  size={18}
                />
                <span className="relative">
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
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
                  className="relative"
                />
                <button
                  onClick={navigateToChat}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <MessageSquare className="w-5 h-5" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-ping-once">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base font-medium transition-colors duration-300 group py-2 relative"
                >
                  <User
                    className="mr-2 text-gray-500 group-hover:text-blue-600 transition-colors duration-300"
                    size={18}
                  />
                  <span className="relative">
                    Profile
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center text-sm font-medium transform hover:translate-y-[-2px] active:translate-y-[0px]"
                >
                  Logout <LogOut className="ml-1.5" size={16} />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base font-medium transition-colors duration-300 group py-2 relative"
                >
                  <User
                    className="mr-2 text-gray-500 group-hover:text-blue-600 transition-colors duration-300"
                    size={18}
                  />
                  <span className="relative">
                    Sign Up
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                  </span>
                </a>
                <a
                  href="/login"
                  className="bg-[#00A9FF] text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center text-sm font-medium transform hover:translate-y-[-2px] active:translate-y-[0px]"
                >
                  Login <LogIn className="ml-1.5" size={16} />
                </a>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
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
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <MessageSquare className="w-5 h-5" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-ping-once">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              className="p-2.5 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen
            ? "max-h-[500px] opacity-100 border-b border-gray-100"
            : "max-h-0 opacity-0"
        } md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col w-full overflow-hidden transition-all duration-400 ease-in-out z-40`}
      >
        <div className="px-5 py-4 space-y-2.5">
          {NavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center text-base font-medium px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <link.icon className="mr-3.5 text-gray-500" size={18} />
              {link.label}
            </a>
          ))}

          <div className="border-t border-gray-100 my-3 pt-3 space-y-2.5">
            {isAuthenticated ? (
              <>
                <button
                  onClick={navigateToChat}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <MessageSquare className="w-5 h-5" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-ping-once">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 w-full"
                >
                  <User className="mr-3.5 text-gray-500" size={18} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:shadow-md transition-all duration-300 flex items-center justify-center text-base font-medium w-full mt-4"
                >
                  Logout <LogOut className="ml-2.5" size={18} />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 w-full"
                >
                  <User className="mr-3.5 text-gray-500" size={18} />
                  Sign Up
                </a>
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:shadow-md transition-all duration-300 flex items-center justify-center text-base font-medium w-full mt-3"
                >
                  Login <LogIn className="ml-2.5" size={18} />
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
