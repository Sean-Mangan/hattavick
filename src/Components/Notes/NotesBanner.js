import React, { useState, useEffect } from "react";
import "./NotesBanner.css"; // Optional: Add a CSS file for styling
import { Button } from "@mui/material";
import {
  useGetTypeNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "../../features/campaign/campaignApiSlice";
import { useOutletContext } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRef } from "react";
import MultiLineTextField from "../MultiLineTextField/MultiLineTextField";
import MultiLineTextDisplay from "../MultiLineTextDisplay/MultiLineTextDisplay";

const NoteRow = ({ note, relatedId, noteType, campaignId }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [delCount, setDelCount] = React.useState(0);

  const [noteTitle, setNoteTitle] = useState(note.title || "");
  const [noteContent, setNoteContent] = useState(note.data || "");
  const [isPrivate, setIsPrivate] = useState(note.is_private || false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingAssets, setExistingAssets] = useState(
    note.assets || { image: [], other: [] },
  );

  // Manage files when added or removed
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);

  const [deleteNote] = useDeleteNoteMutation({
    fixedCacheKey: `delete-${noteType}-note`,
  });
  const [updateNote] = useUpdateNoteMutation({
    fixedCacheKey: `update-${noteType}-note`,
  });

  const { userId } = useOutletContext();
  let isNoteOwner = note.author_id === userId;

  const handleEdit = async () => {
    if (editMode) {
      const noteForm = new FormData();
      noteForm.append("title", noteTitle);
      noteForm.append("data", noteContent);
      noteForm.append("is_private", isPrivate);
      noteForm.append("removed_files", JSON.stringify(removedFiles));
      // Append each file to the FormData
      uploadedFiles.forEach((file, index) => {
        noteForm.append(`file_${index}`, file);
      });
      await updateNote({
        campaignId,
        relatedId,
        noteType,
        noteId: note.note_id,
        formData: noteForm,
      }).unwrap();
    }
    setEditMode(!editMode);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file name already exists
      let isDuplicate = uploadedFiles.some(
        (uploadedFile) => uploadedFile.name === file.name,
      );
      isDuplicate =
        isDuplicate ||
        existingAssets.image.includes(file.name) ||
        existingAssets.audio.includes(file.name) ||
        existingAssets.other.includes(file.name);
      if (isDuplicate) {
        alert("This file has already been added.");
        e.target.value = ""; // Reset the input value
        return;
      }

      setUploadedFiles([...uploadedFiles, file]);
      setSelectedFiles([...selectedFiles, file]);
      e.target.value = ""; // Reset the input value
    }
  };

  const handleRemoveFile = (fileName) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== fileName));
  };

  const handleDelete = async () => {
    if (delCount < 1) {
      setDelCount(delCount + 1);
    } else {
      try {
        await deleteNote({
          noteId: note.note_id,
          noteType,
          relatedId,
          campaignId,
        }).unwrap();
        setDelCount(0); // Reset delete count after successful deletion
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  const handleRemoveExistingAsset = (url) => {
    setRemovedFiles([...removedFiles, url]);
    if (existingAssets.image.includes(url)) {
      setExistingAssets({
        ...existingAssets,
        image: existingAssets.image.filter((item) => item !== url),
      });
    } else if (existingAssets.audio.includes(url)) {
      setExistingAssets({
        ...existingAssets,
        audio: existingAssets.audio.filter((item) => item !== url),
      });
    } else if (existingAssets.other.includes(url)) {
      setExistingAssets({
        ...existingAssets,
        other: existingAssets.other.filter((item) => item !== url),
      });
    }
    setSelectedFiles(
      selectedFiles.filter((file) => file.name !== url.split("/").pop()),
    );
  };

  const toggleCollapse = () => {
    if (!collapsed && editMode) {
      alert("Please save or cancel your changes before collapsing.");
      return;
    }
    setCollapsed(!collapsed); // Toggle the collapsed state
  };

  useEffect(() => {
    // Update existingAssets whenever the note prop changes
    setExistingAssets(note.assets || { image: [], other: [], audio: [] });
  }, [note]);

  return (
    <div className="note-row">
      <div
        className="note-edit-wrapper"
        style={{ display: editMode ? "block" : "none" }}
      >
        <form>
          <div
            className="note-action-wrap"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Switch
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                disabled={!editMode}
                color="primary"
              />
              <span>{isPrivate ? "Private" : "Public"}</span>
            </div>
            <div
              className="note-actions"
              style={{ display: isNoteOwner ? "flex" : "none", gap: "10px" }}
            >
              <Button variant="outlined" color="primary" onClick={handleEdit}>
                {editMode ? "Save" : "Edit"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                {delCount > 0 ? `Confirm Delete` : "Delete"}
              </Button>
            </div>
          </div>
          <TextField
            label="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <MultiLineTextField
            value={noteContent}
            onChange={setNoteContent}
            placeholder="Enter note content here..."
          />
          <div className="asset-edit-wrap" style={{ marginTop: "1rem" }}>
            {existingAssets.image.map((url, index) => (
              <div
                key={`${url}${index}${relatedId}existingimage`}
                className="file-item"
              >
                <img
                  src={url}
                  alt={`Asset ${url}`}
                  style={{ maxWidth: "100px", margin: "5px" }}
                />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveExistingAsset(url)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {existingAssets.audio.map((url, index) => (
              <div
                key={`${url}${index}${relatedId}existingaudio`}
                className="file-item"
              >
                {url.split("/").pop()}{" "}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveExistingAsset(url)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {existingAssets.other.map((url, index) => (
              <div
                key={`${url}${index}${relatedId}existingother`}
                className="file-item"
              >
                {url.split("/").pop()}{" "}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveExistingAsset(url)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {uploadedFiles.map((file, index) => (
              <div key={file.name} className="file-item">
                {file.name}{" "}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveFile(file.name)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              accept="*/*"
              single
              ref={fileInputRef}
              hidden
            />
            <Button
              className="add-file-btn"
              variant="contained"
              color="success"
              onClick={() => fileInputRef.current.click()}
              startIcon={<AddIcon />}
            >
              Add File
            </Button>
          </div>
        </form>
      </div>
      <div
        className="note-display-wrapper"
        style={{ display: editMode ? "none" : "block" }}
      >
        <div className="note-display-header">
          <div className="note-header-top">
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            ></div>
            <div
              className="note-action-wrap"
              style={{
                display: "flex",
                justifyContent: "space-between",
                textAlign: "right",
              }}
            >
              <div
                className="note-actions"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleEdit}
                  style={{
                    display: isNoteOwner && !collapsed ? "block" : "none",
                  }}
                >
                  {editMode ? "Save" : "Edit"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={toggleCollapse}
                  startIcon={
                    collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />
                  }
                  style={{ marginLeft: "10px" }}
                >
                  {collapsed ? "Expand" : "Collapse"}
                </Button>
              </div>
            </div>
          </div>
          <div className="note-header-bottom">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-author">By: {note.author_name}</p>
            <p className="note-date">
              Created: {new Date(note.created).toLocaleDateString()}
            </p>
            <p className="note-date">
              Last Updated: {new Date(note.modified).toLocaleDateString()}
            </p>
            <p className="note-author">
              {isPrivate ? "Private " : "Public "}Note
            </p>
          </div>
        </div>
        <div hidden={collapsed} className="note-content-wrapper">
          <MultiLineTextDisplay text={note.data} />
          <div className="note-assets">
            {existingAssets.image.length > 0 && (
              <>
                <h4>Images:</h4>
                <div className="note-images">
                  {existingAssets.image.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Asset ${index}`}
                      style={{
                        maxWidth: "100px",
                        margin: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(url, "_blank")}
                    />
                  ))}
                </div>
              </>
            )}
            {existingAssets.audio.length > 0 && (
              <>
                <h4>Audio:</h4>
                <div className="note-audio">
                  {existingAssets.audio.map((url, index) => (
                    <div
                      key={url}
                      className="audio-item"
                      style={{ margin: "10px 0" }}
                    >
                      <p>{url.split("/").pop()}</p>
                      <audio
                        controls
                        src={url}
                        style={{ width: "100%" }}
                        aria-label={`Audio file ${index + 1}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              </>
            )}
            {existingAssets.other.length > 0 && (
              <>
                <h4>Other Files:</h4>
                <ul>
                  {existingAssets.other.map((url, index) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotesBanner = ({ noteType, relatedId, campaignId }) => {
  console.log("Rendering NotesBanner with:", {
    noteType,
    relatedId,
    campaignId,
  });

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
  } = useGetTypeNotesQuery({ campaignId, noteType });
  const [createNote] = useCreateNoteMutation({
    fixedCacheKey: `create-${noteType}-note`,
  });

  // Filter out any notes that are note related to the current entity
  let filteredNotes = [];
  if (isSuccess) {
    filteredNotes = notes.filter((note) => note.related_id === relatedId);
  }

  const handleCreateNote = async (e) => {
    e.preventDefault();
    const form_data = new FormData();
    await createNote({
      campaignId,
      relatedId,
      formData: form_data,
      noteType,
    }).unwrap();
  };

  return (
    <div className="notes-banner">
      <div className="notes-banner-header">
        <h1>Notes</h1>
        <Button
          variant="contained"
          color="primary"
          className="add-note-button"
          onClick={handleCreateNote}
          startIcon={<AddIcon />}
        >
          Add Note
        </Button>
      </div>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes. Please try again later.</p>}
      {isSuccess && filteredNotes.length === 0 && (
        <p>No notes available. Click "Add Note" to create one.</p>
      )}

      {/* Render the list of notes */}
      {isSuccess && filteredNotes.length > 0 && (
        <div className="notes-list">
          {filteredNotes.map((note, index) => (
            <NoteRow
              key={note.note_id}
              note={note}
              relatedId={relatedId}
              noteType={noteType}
              campaignId={campaignId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesBanner;
