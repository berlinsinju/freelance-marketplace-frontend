import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    fetchNotifications();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-teal-700 hover:bg-teal-50"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-teal-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-teal-100 px-4 py-2">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={markAllRead}
              className="text-xs text-teal-600 hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-ink/50">
                No notifications yet
              </p>
            )}
            {notifications.map((n) => (
              <Link
                key={n._id}
                to={n.link || "#"}
                onClick={() => setOpen(false)}
                className={`block border-b border-teal-50 px-4 py-3 text-sm hover:bg-teal-50 ${
                  !n.isRead ? "bg-teal-50/60 font-medium" : ""
                }`}
              >
                {n.message}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
