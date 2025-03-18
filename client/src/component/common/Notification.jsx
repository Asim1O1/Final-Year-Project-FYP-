import { Bell, Check, Clock, Info, AlertTriangle, X } from "lucide-react";
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
    } else if (notification.type === "appointment" && notification.relatedId) {
      console.log("entered the else")
      navigate(`/appointments/${notification.relatedId}`);
    }
    // Add more conditions for other types if needed
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

  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info size={16} className="text-blue-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "error":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "success":
        return <Check size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // Format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        aria-label="Notifications"
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
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 transition-all duration-300 transform origin-top-right">
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
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={toggleNotifications}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter/Sort Options */}
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200">
                All
              </button>
              <button className="text-xs text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
                Unread
              </button>
            </div>
            <select className="text-xs text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer hover:text-blue-600 transition-colors duration-200">
              <option>Latest first</option>
              <option>Oldest first</option>
            </select>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-gray-500 text-center flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-gray-100">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <p className="font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400">
                  New notifications will appear here
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([date, dateNotifications]) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 border-t border-gray-200 shadow-sm">
                      {date === new Date().toLocaleDateString()
                        ? "Today"
                        : date}
                    </div>
                    {dateNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          handleNotificationClick(notification._id)
                        }
                        className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                          notification.read ? "bg-gray-50" : "bg-white"
                        }`}
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
                                <span className="h-2 w-2 bg-blue-600 rounded-full mt-1 ml-2 animate-pulse"></span>
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
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center bg-gradient-to-r from-gray-50 to-gray-100">
              <button
                onClick={handleClearNotifications}
                className="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors duration-200 px-3 py-1 rounded-full hover:bg-gray-200"
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
