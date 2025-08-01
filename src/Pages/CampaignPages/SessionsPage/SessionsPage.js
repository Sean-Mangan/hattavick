import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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

function SessionsPage() {
  // Get the outlet context
  const { isAdmin, campaignId } = useOutletContext();

  // Some helpful RTK Things
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

  // Set some helpful state variables
  const [sessions, setSessions] = useState([]);

  /**
   * Will attempt to delete the given session
   * @param {*} idx The index of the session to delete
   * @returns
   */
  const handleDelCount = async (idx) => {
    // If the del count is 0 then iterate up
    if (sessions[idx].delCount === 0) {
      const new_edits = sessions.slice();
      new_edits[idx].delCount = 1;
      setSessions(new_edits);
      return;
    }

    // Try to perform the deletion
    try {
      await deleteSession({
        campaignId,
        sessionId: sessions[idx].session_id,
      }).unwrap();
    } catch (e) {}
  };

  /**
   * Helpful function to create a new session.
   */
  const create_new_session = async () => {
    try {
      await createSession(campaignId).unwrap();
    } catch (e) {}
  };

  /**
   * Will handle setting the editability of a session
   * @param {*} idx The session index to update
   * @returns
   */
  const handleEditSwap = async (idx) => {
    // See if the current data aligns with the edited data
    const isSame = [
      data[idx].data === sessions[idx].data,
      data[idx].date === sessions[idx].date,
      data[idx].title === sessions[idx].title,
    ].every((isTrue) => isTrue);

    // See if the currently selected session is editable
    if (!sessions[idx].edit || isSame) {
      const new_edits = sessions.slice();
      new_edits[idx].edit = !new_edits[idx].edit;
      setSessions(new_edits);
      return;
    }

    // Put together the form data
    const form_data = new FormData();
    form_data.append("title", sessions[idx].title);
    form_data.append("date", sessions[idx].date);
    form_data.append("data", sessions[idx].data);

    // Attempt to perform the update
    try {
      await updateSession({
        campaignId,
        sessionId: sessions[idx].session_id,
        formData: form_data,
      }).unwrap();
    } catch (e) {}
  };

  /**
   * Will update the given session data
   * @param {*} idx The session index to update
   * @param {*} v The value of the json to update
   * @param {*} k the key of the json to update
   */
  const handleChange = (idx, v, k) => {
    const new_edits = sessions.slice();
    new_edits[idx][k] = v;
    setSessions(new_edits);
  };

  // Make sure the session data is set on crud operations
  useEffect(() => {
    const sessionCopy = data.map((elem) => {
      return { ...elem, edit: false, delCount: 0 };
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
                      <>{session.title ? session.title : "None"} </>
                    ) : (
                      <TextField
                        value={session.title}
                        label={"Title"}
                        onChange={(e) =>
                          handleChange(idx, e.target.value, "title")
                        }
                      />
                    )}
                  </h3>
                </AccordionSummary>
                <AccordionDetails className="accordian-data-wrap">
                  <div
                    className="edit-btn-wrap"
                    style={{ display: `${isAdmin ? "block" : "none"}` }}
                  >
                    {!session.edit ? (
                      <></>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleDelCount(idx);
                        }}
                      >
                        {session.delCount === 0 ? "Delete" : "Are You Sure?"}
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
                  {!session.edit ? (
                    <div className="accordian-data-wrap">
                      {session.date ? (
                        <strong className="session-date">
                          {session.date}
                          <br />
                        </strong>
                      ) : (
                        <></>
                      )}
                      <MultiLineTextDisplay
                        text={session.data || ""}
                        className="accordian-data-wrap"
                      />
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={session.date}
                        label={"Date"}
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
      {isAdmin ? (
        <Button
          onClick={() => create_new_session()}
          variant="contained"
          style={{ marginTop: "1em" }}
        >
          <AddIcon />
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SessionsPage;
