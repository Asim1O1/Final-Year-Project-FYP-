import React from "react";
import { Bell, Check, Clock, Info, AlertTriangle, X } from "lucide-react";

const Notifications = ({
  notifications = [],
  isNotificationsOpen = false,
  toggleNotifications,
  unreadCount = 0,
  markAsRead,
  markAllAsRead,
  clearNotifications,
}) => {
  const handleNotificationClick = (notificationId) => {
    if (typeof markAsRead === "function") {
      markAsRead(notificationId);
    } else {
      console.warn("markAsRead function is not properly defined");
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
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell
          className="text-gray-600 hover:text-blue-500 transition"
          size={22}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bell size={18} /> Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={toggleNotifications}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter/Sort Options */}
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                All
              </button>
              <button className="text-xs text-gray-500 px-2 py-1 rounded-full hover:bg-gray-100">
                Unread
              </button>
            </div>
            <select className="text-xs text-gray-500 bg-transparent border-none">
              <option>Latest first</option>
              <option>Oldest first</option>
            </select>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-gray-500 text-center flex flex-col items-center gap-2">
                <Bell size={32} className="text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-xs text-gray-400">
                  New notifications will appear here
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([date, dateNotifications]) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-gray-100 px-4 py-1 text-xs font-medium text-gray-500 border-t border-gray-200">
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
                        className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition ${
                          notification.read ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm ${
                                  !notification.read ? "font-medium" : ""
                                }`}
                              >
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 ml-2"></span>
                              )}
                            </div>

                            {notification.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.description}
                              </p>
                            )}

                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={12} />
                                {getRelativeTime(notification.createdAt)}
                              </div>

                              {notification.action && (
                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                  {notification.action}
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
            <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
              <button
                onClick={handleClearNotifications}
                className="text-xs text-gray-500 hover:text-gray-700"
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
