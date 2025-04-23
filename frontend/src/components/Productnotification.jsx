import React, { useState } from "react";

const NotificationBell = ({ notifications, markNotificationAsSeen }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const unseenNotifications = notifications.filter(
    (notification) => !notification.seen
  );

  return (
    <div className="position-relative d-inline-block" style={{ float: "right" }}>
      {/* Bell Icon */}
      <div
        className="bell-icon"
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
      >
        <span role="img" aria-label="bell">🔔</span>

        {/* Show notification badge if there are unseen notifications */}
        {unseenNotifications.length > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unseenNotifications.length}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {dropdownVisible && unseenNotifications.length > 0 && (
        <div
          className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2"
          style={{ width: "300px", zIndex: 1000 }}
        >
          <ul className="list-unstyled mb-0">
            {unseenNotifications.map((notification) => (
              <li
                key={notification.id}
                className="d-flex justify-content-between align-items-center p-2 border-bottom"
              >
                <span>{notification.message}</span>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    markNotificationAsSeen(notification.id); // Mark as seen
                  }}
                  aria-label="Mark as read"
                >
                  ✓ {/* Checkmark symbol */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;