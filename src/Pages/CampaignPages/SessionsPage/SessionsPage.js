import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import "./SessionsPage.css";
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionsQuery,
  useUpdateSessionMutation,
} from "../../../features/campaign/campaignApiSlice";

import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import Settings from "../../../config/settings.json";

/**
 * SessionsPage component for managing campaign session notes.
 * Allows admins to create, edit, and delete session notes.
 * Players can view session notes in read-only mode.
 *
 * @returns {JSX.Element} The sessions page with accordion-style note entries
 */
function SessionsPage() {
  // Get the outlet context
  const { isAdmin, campaignId } = useOutletContext();

  // RTK Query hooks
  const { data } = useGetSessionsQuery(campaignId);
  const [createSession] = useCreateSessionMutation({
    fixedCacheKey: "create-session",
  });
  const [updateSession] = useUpdateSessionMutation({
    fixedCacheKey: "update-session",
  });
  const [deleteSession] = useDeleteSessionMutation({
    fixedCacheKey: "delete-session",
  });

  // State variables
  const [sessions, setSessions] = useState([]);

  /**
   * Attempts to delete the given session.
   * Requires double confirmation (increment delete count, then confirm).
   *
   * @param {number} idx - The index of the session to delete
   */
  const handleDelCount = async (idx) => {
    // If the delete count is 0 then increment
    if (sessions[idx].delCount === Settings.UI.DELETE_COUNT_INITIAL) {
      const newEdits = sessions.slice();
      newEdits[idx].delCount = Settings.UI.DELETE_COUNT_CONFIRM;
      setSessions(newEdits);
      return;
    }

    // Try to perform the deletion
    try {
      await deleteSession({
        campaignId,
        sessionId: sessions[idx].session_id,
      }).unwrap();
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  /**
   * Creates a new session for the campaign.
   */
  const createNewSession = async () => {
    try {
      await createSession(campaignId).unwrap();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  /**
   * Handles toggling edit mode and saving session changes.
   *
   * @param {number} idx - The session index to update
   */
  const handleEditSwap = async (idx) => {
    // Check if the current data aligns with the edited data
    const isSame = [
      data[idx].data === sessions[idx].data,
      data[idx].date === sessions[idx].date,
      data[idx].title === sessions[idx].title,
    ].every((isTrue) => isTrue);

    // If not in edit mode or no changes, just toggle edit mode
    if (!sessions[idx].edit || isSame) {
      const newEdits = sessions.slice();
      newEdits[idx].edit = !newEdits[idx].edit;
      setSessions(newEdits);
      return;
    }

    // Put together the form data
    const formData = new FormData();
    formData.append("title", sessions[idx].title);
    formData.append("date", sessions[idx].date);
    formData.append("data", sessions[idx].data);

    // Attempt to perform the update
    try {
      await updateSession({
        campaignId,
        sessionId: sessions[idx].session_id,
        formData: formData,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  /**
   * Updates the given session data field.
   *
   * @param {number} idx - The session index to update
   * @param {any} value - The new value
   * @param {string} key - The key of the field to update
   */
  const handleChange = (idx, value, key) => {
    const newEdits = sessions.slice();
    newEdits[idx][key] = value;
    setSessions(newEdits);
  };

  // Initialize session data with edit and delCount properties on data changes
  useEffect(() => {
    const sessionCopy = data.map((elem) => {
      return {
        ...elem,
        edit: false,
        delCount: Settings.UI.DELETE_COUNT_INITIAL,
      };
    });
    setSessions(sessionCopy);
  }, [data]);

  return (
    <div className="sessions-wrapper">
      <div className="sessions-title">Session Notes</div>
      <div className="session-accordian-wrap">
        {sessions.map((session, idx) => {
          return (
            <div key={session.session_id}>
              <Accordion style={{ border: "1px solid grey" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <h3 style={{ padding: "0", margin: "0", width: "100%" }}>
                    {!session.edit ? (
                      <>{session.title || "None"} </>
                    ) : (
                      <TextField
                        value={session.title}
                        label="Title"
                        onChange={(e) =>
                          handleChange(idx, e.target.value, "title")
                        }
                      />
                    )}
                  </h3>
                </AccordionSummary>
                <AccordionDetails className="accordian-data-wrap">
                  {/* Edit buttons (admin only) */}
                  <div
                    className="edit-btn-wrap"
                    style={{ display: `${isAdmin ? "block" : "none"}` }}
                  >
                    {session.edit && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleDelCount(idx);
                        }}
                      >
                        {session.delCount === Settings.UI.DELETE_COUNT_INITIAL
                          ? "Delete"
                          : "Are You Sure?"}
                      </Button>
                    )}
                    {!session.edit ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleEditSwap(idx);
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleEditSwap(idx);
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </div>

                  {/* Display mode */}
                  {!session.edit ? (
                    <div className="accordian-data-wrap">
                      {session.date && (
                        <strong className="session-date">
                          {session.date}
                          <br />
                        </strong>
                      )}
                      <MultiLineTextDisplay
                        text={session.data || ""}
                        className="accordian-data-wrap"
                      />
                    </div>
                  ) : (
                    /* Edit mode */
                    <>
                      <TextField
                        value={session.date}
                        label="Date"
                        onChange={(e) =>
                          handleChange(idx, e.target.value, "date")
                        }
                      />

                      <MultiLineTextField
                        className="session-textarea"
                        onChange={(value) => handleChange(idx, value, "data")}
                        value={session.data || ""}
                        placeholder="Session notes..."
                      />
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </div>

      {/* Add new session button (admin only) */}
      {isAdmin && (
        <Button
          onClick={() => createNewSession()}
          variant="contained"
          style={{ marginTop: "1em" }}
        >
          <AddIcon />
        </Button>
      )}
    </div>
  );
}

export default SessionsPage;
