import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Filter,
  Info,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = ({
  notifications = [],
  isNotificationsOpen = false,
  toggleNotifications,
  unreadCount = 0,
  markAsRead,
  markAllAsRead,
  clearNotifications,
}) => {
  const navigate = useNavigate();
  const notificationsPanelRef = useRef(null);

  // State for filter and sort
  const [activeFilter, setActiveFilter] = useState("all"); // "all" or "unread"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  // Apply filters and sorting
  const getFilteredAndSortedNotifications = () => {
    // Filter notifications
    const filteredNotifications =
      activeFilter === "all"
        ? notifications
        : notifications.filter((notification) => !notification.read);

    // Sort notifications
    return [...filteredNotifications].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  // Get filtered and sorted notifications
  const filteredAndSortedNotifications = getFilteredAndSortedNotifications();

  // Notification handlers
  const handleNotificationClick = (notificationId) => {
    if (typeof markAsRead === "function") {
      markAsRead(notificationId);
    } else {
      console.warn("markAsRead function is not properly defined");
    }
  };

  const handleLearnMoreClick = (notification) => {
    if (notification.type === "campaign" && notification.relatedId) {
      navigate(`/campaigns/${notification.relatedId}`);
      toggleNotifications(); // Close panel after navigation
    } else if (notification.type === "appointment" && notification.relatedId) {
      navigate(`/appointments/${notification.relatedId}`);
      toggleNotifications(); // Close panel after navigation
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (typeof markAllAsRead === "function") {
      markAllAsRead();
    } else {
      console.warn("markAllAsRead function is not properly defined");
    }
  };

  // Handle clear all notifications
  const handleClearNotifications = () => {
    if (typeof clearNotifications === "function") {
      clearNotifications();
    } else {
      console.warn("clearNotifications function is not properly defined");
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <Clock size={16} className="text-purple-500" />;
      case "message":
        return <Info size={16} className="text-blue-500" />;
      case "payment":
        return <Check size={16} className="text-green-500" />;
      case "campaign":
        return <AlertTriangle size={16} className="text-orange-500" />;
      case "test_booking":
        return <Clock size={16} className="text-indigo-500" />;
      case "doctor":
        return <Info size={16} className="text-teal-500" />;
      case "medical_report":
        return <Info size={16} className="text-pink-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  // Group notifications by date
  const groupNotificationsByDate = (notificationsToGroup) => {
    return notificationsToGroup.reduce((groups, notification) => {
      const date = new Date(notification.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  };

  // Grouped notifications after filtering and sorting
  const groupedNotifications = groupNotificationsByDate(
    filteredAndSortedNotifications
  );

  // Format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return `Yesterday`;
    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        aria-label="Notifications"
        aria-expanded={isNotificationsOpen}
        aria-haspopup="true"
      >
        <Bell
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
          size={22}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div
          ref={notificationsPanelRef}
          className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Notifications panel"
          onClick={(e) => {
            // Prevent click inside the panel from closing it
            e.stopPropagation();
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bell size={18} className="text-blue-600" /> Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full shadow-sm">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  aria-label="Mark all notifications as read"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={toggleNotifications}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter/Sort Options */}
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <button
                className={`text-xs ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                } px-3 py-1 rounded-full font-medium shadow-sm transition-colors duration-200`}
                onClick={() => setActiveFilter("all")}
                aria-pressed={activeFilter === "all"}
              >
                All
              </button>
              <button
                className={`text-xs ${
                  activeFilter === "unread"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                } px-3 py-1 rounded-full font-medium shadow-sm transition-colors duration-200`}
                onClick={() => setActiveFilter("unread")}
                aria-pressed={activeFilter === "unread"}
              >
                Unread
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Filter size={12} className="text-gray-500" />
              <select
                className="text-xs text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer hover:text-blue-600 transition-colors duration-200"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort notifications"
              >
                <option value="newest">Latest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div
            className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            role="log"
            aria-live="polite"
          >
            {filteredAndSortedNotifications.length === 0 ? (
              <div className="p-8 text-gray-500 text-center flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-gray-100">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <p className="font-medium">
                  {activeFilter === "all"
                    ? "No notifications yet"
                    : "No unread notifications"}
                </p>
                <p className="text-xs text-gray-400">
                  {activeFilter === "all"
                    ? "New notifications will appear here"
                    : "All notifications have been read"}
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([date, dateNotifications]) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 border-t border-gray-200 shadow-sm">
                      {date === new Date().toLocaleDateString()
                        ? "Today"
                        : date ===
                          new Date(Date.now() - 86400000).toLocaleDateString()
                        ? "Yesterday"
                        : date}
                    </div>
                    {dateNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={(e) =>
                          handleNotificationClick(notification._id, e)
                        }
                        className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                          notification.read ? "bg-gray-50" : "bg-white"
                        }`}
                        role="button"
                        tabIndex="0"
                        aria-pressed={notification.read}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <div className="p-2 rounded-full bg-gray-100">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? "font-medium text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <span
                                  className="h-2 w-2 bg-blue-600 rounded-full mt-1 ml-2 animate-pulse"
                                  aria-label="Unread notification"
                                ></span>
                              )}
                            </div>

                            {notification.description && (
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {notification.description}
                              </p>
                            )}

                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <Clock size={12} />
                                {getRelativeTime(notification.createdAt)}
                              </div>

                              {(notification.type === "campaign" ||
                                notification.type === "appointment") &&
                                notification.relatedId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLearnMoreClick(notification);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                                    aria-label={`Learn more about ${notification.message}`}
                                  >
                                    Learn More
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          {/* Footer */}
          {filteredAndSortedNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center bg-gradient-to-r from-gray-50 to-gray-100">
              <button
                onClick={handleClearNotifications}
                className="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors duration-200 px-3 py-1 rounded-full hover:bg-gray-200"
                aria-label="Clear all notifications"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
