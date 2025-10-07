import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGetPartyDataQuery } from "../../features/campaign/campaignApiSlice";

/**
 * SystemNotificationWrapper component
 * Displays system notifications based on campaign state
 * Currently shows notification when no party members are added
 */
const SystemNotificationWrapper = () => {
  const [showNotifications, setShowNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const { campaignId, isAdmin } = useOutletContext();
  const {
    data: partyData,
    isFetching: partyFetching,
    isError: partyError,
  } = useGetPartyDataQuery(campaignId);

  // Effect for checking to see if there are any party members
  useEffect(() => {
    if (!partyFetching && !partyError) {
      if (partyData && partyData.length === 0) {
        setNotifications([
          {
            title: "Add Some Party Members!",
            message:
              "Looks like you haven't added any friends to the campaign yet. You can add party members from the campaign settings! Added players can view, interact with and create notes for the campaign!",
            severity: "info",
          },
        ]);
        setShowNotifications([true]);
      } else {
        setNotifications([]);
        setShowNotifications([]);
      }
    }
  }, [partyFetching, partyData, partyError]);

  /**
   * Handle notification close
   * @param {number} idx - Index of notification to close
   */
  const handleClose = (idx) => {
    setShowNotifications((prev) => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
  };

  return (
    <>
      {notifications.map(
        (notification, idx) =>
          showNotifications[idx] && (
            <Alert
              key={idx}
              severity={notification.severity || "info"}
              onClose={() => handleClose(idx)}
              style={{ marginBottom: "1rem" }}
            >
              <AlertTitle>
                {notification.title || "System Notification"}
              </AlertTitle>
              {notification.message}
            </Alert>
          )
      )}
    </>
  );
};

export default SystemNotificationWrapper;
