import { SaveOutlined } from "@mui/icons-material";
import {
  Button,
  Grid,
  Paper,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import "./NPCPage.css";
import {
  useDeleteNPCMutation,
  useGetNPCDataQuery,
  useUpdateNPCMutation,
} from "../../../features/campaign/campaignApiSlice";
import NotesBanner from "../../../Components/Notes/NotesBanner";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import Settings from "../../../config/settings.json";

/**
 * NPCPage component for viewing and managing NPC characters in a D&D campaign.
 * Provides different views for admins (full edit capabilities) and players (public info only).
 *
 * @returns {JSX.Element} The NPC management page
 */
function NPCPage() {
  // Get campaign id and if the user is an admin
  const { campaignId, isAdmin } = useOutletContext();

  // Hooks for RTK mutations and navigation
  const [updateNPC] = useUpdateNPCMutation({ fixedCacheKey: "update-npc" });
  const [deleteNPC] = useDeleteNPCMutation({ fixedCacheKey: "delete-npc" });
  const navigate = useNavigate();
  const { characterId } = useParams();

  // Get all characters and filter down to the NPC in question
  const { data: npcs } = useGetNPCDataQuery(campaignId);
  const filteredNPCs = npcs.filter(
    (character) => character.character_id === characterId,
  );
  const npc = filteredNPCs.length === 1 ? filteredNPCs[0] : {};

  // State variables to handle UI
  const [charData, setCharData] = useState(npc);
  const [img, setImg] = useState(npc.image);
  const [delCount, setDelCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  // File input ref for character image
  const hiddenCharacterFileInput = useRef(null);

  /**
   * Handles file input change when user selects a new character image
   * @param {Event} event - The file input change event
   */
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setCharData({ ...charData, image: fileUploaded });
    setImg(URL.createObjectURL(fileUploaded));
  };

  /**
   * Triggers the hidden file input click
   */
  const handleClick = () => {
    hiddenCharacterFileInput.current?.click();
  };

  /**
   * Handles updating the given NPC
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const formData = new FormData();
    const updateImage = charData.image !== img;
    if (charData.img !== img) {
      formData.append("image", charData.image);
    }
    formData.append("name", charData.name);
    formData.append("backstory", charData.backstory);
    formData.append("description", charData.description);
    formData.append("public", charData.public);
    formData.append("name", charData.name);
    formData.append("visible", charData.visible);
    formData.append("job", charData.job);
    formData.append("location", charData.location);

    // Attempt to perform the update
    try {
      await updateNPC({
        campaignId,
        characterId,
        formData: formData,
      }).unwrap();
      setDelCount(0);
      setEditMode(!editMode);
      if (updateImage) setImg(URL.createObjectURL(charData.image));
    } catch (error) {
      console.error("Failed to update NPC:", error);
    }
  };

  /**
   * Handles deleting the current character
   */
  const handleDelete = async () => {
    if (delCount === 0) {
      setDelCount(1);
    } else {
      try {
        await deleteNPC({ campaignId, characterId }).unwrap();
        navigate(`/campaign/${campaignId}/characters/npcs`);
      } catch (error) {
        console.error("Failed to delete NPC:", error);
      }
    }
  };

  // Reset the character when there are edits made
  useEffect(() => {
    setCharData(npc);
    setImg(npc.image);
  }, [npc, characterId]);

  return (
    <div className="pc-wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* Admin view */}
        {isAdmin ? (
          <>
            {/* Admin buttons */}
            <div className="char-page-btn-wrapper">
              <Button
                variant="outlined"
                disabled={!editMode}
                onClick={() =>
                  setCharData({ ...charData, visible: !charData.visible })
                }
              >
                {charData.visible ? "Visible" : "Invisible"}
              </Button>
              <Button
                variant="contained"
                color="error"
                style={{ display: !editMode ? "none" : "inline-flex" }}
                onClick={() => handleDelete()}
              >
                {delCount === 0 ? "Delete?" : "Are you Sure?"}
              </Button>
              {editMode ? (
                <Button
                  key="save"
                  type="submit"
                  className="char-page-edit-btn"
                  variant="contained"
                  endIcon={<SaveOutlined />}
                >
                  Save
                </Button>
              ) : (
                <Button
                  key="edit"
                  className="char-page-edit-btn"
                  variant="contained"
                  color="error"
                  endIcon={<EditIcon />}
                  onClick={() => {
                    setEditMode(!editMode);
                    setDelCount(0);
                  }}
                >
                  Edit
                </Button>
              )}
            </div>

            {/* Admin display mode */}
            {!editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <div
                    className="char-page-title"
                    style={{
                      fontSize: "40px",
                      letterSpacing: "-3px",
                      marginTop: "0",
                    }}
                  >
                    <strong>
                      {charData?.name || Settings.DEFAULTS.DEFAULT_NAME_ADMIN}
                    </strong>
                  </div>
                  <img
                    key={img}
                    className="char-page-pc-img"
                    src={img || Settings.IMAGES.DEFAULT_AVATAR_URL}
                    alt={charData?.name || "NPC portrait"}
                  />
                  <div className="sm-menu-wrapper">
                    <strong>Location:</strong> {charData.location}
                    <br />
                    <strong>Job:</strong> {charData.job}
                  </div>
                  <div className="char-page-desc-wrapper">
                    <i>{charData.description}</i>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={12}
                    style={{
                      paddingBottom: "2em",
                      paddingTop: "1em",
                      paddingLeft: "1em",
                      paddingRight: "1em",
                    }}
                  >
                    <div className="char-page-title char-page-subtitle">
                      Private backstory
                    </div>
                    <MultiLineTextDisplay text={charData?.backstory} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={12}
                    style={{
                      paddingBottom: "2em",
                      paddingTop: "1em",
                      paddingLeft: "1em",
                      paddingRight: "1em",
                      overflowY: "show",
                    }}
                  >
                    <div className="char-page-title char-page-subtitle">
                      Public backstory
                    </div>
                    <MultiLineTextDisplay text={charData?.public} />
                  </Paper>
                </Grid>
                <Grid item md={12} xs={12}>
                  <NotesBanner
                    noteType="npcs"
                    campaignId={campaignId}
                    relatedId={characterId}
                  />
                </Grid>
              </Grid>
            ) : (
              /* Admin edit mode */
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <input
                    className="char-page-title char-page-text-field"
                    style={{ fontSize: "40px", letterSpacing: "-3px" }}
                    value={charData?.name}
                    onChange={(e) =>
                      setCharData({ ...charData, name: e.target.value })
                    }
                  />
                  <div className="char-page-editable-container">
                    <img
                      key={img}
                      className="char-page-img blur"
                      src={img || Settings.IMAGES.DEFAULT_AVATAR_URL}
                      alt={charData?.name || "NPC portrait"}
                    />
                    <div className="char-page-upload-btn" onClick={handleClick}>
                      Click to Upload a File
                      <br />
                      <span className="char-page-micro-text">
                        {charData?.image?.name}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={hiddenCharacterFileInput}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="sm-menu-wrapper">
                    <TextField
                      label="Job"
                      style={{ paddingBottom: "1em" }}
                      value={charData.job}
                      onChange={(e) =>
                        setCharData({ ...charData, job: e.target.value })
                      }
                    />
                    <TextField
                      label="Location"
                      value={charData.location}
                      onChange={(e) =>
                        setCharData({ ...charData, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="char-page-desc-wrapper">
                    <TextareaAutosize
                      value={charData.description}
                      style={{ textAlign: "center" }}
                      className="char-page-auto-resize-text char-page-overview"
                      onChange={(e) =>
                        setCharData({
                          ...charData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={12} style={{ paddingBottom: "2em" }}>
                    <div className="char-page-title char-page-subtitle">
                      Private backstory
                    </div>
                    <div className="char-page-paper-wrapper">
                      <MultiLineTextField
                        value={charData.backstory}
                        onChange={(value) =>
                          setCharData({ ...charData, backstory: value })
                        }
                        placeholder="Write the private backstory here..."
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={12}
                    style={{ paddingBottom: "2em", overflowY: "visible" }}
                  >
                    <div className="char-page-title char-page-subtitle">
                      Public backstory
                    </div>
                    <div className="char-page-paper-wrapper">
                      <MultiLineTextField
                        value={charData.public}
                        onChange={(value) =>
                          setCharData({ ...charData, public: value })
                        }
                        placeholder="Write the public backstory here..."
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid item md={12} xs={12}>
                  <NotesBanner
                    noteType="npcs"
                    campaignId={campaignId}
                    relatedId={characterId}
                  />
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          /* Player view (non-admin) */
          <>
            <div className="char-page-pc-space" />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <div
                  className="char-page-title"
                  style={{
                    fontSize: "40px",
                    letterSpacing: "-3px",
                    marginTop: "0",
                  }}
                >
                  <strong>
                    {charData?.name || Settings.DEFAULTS.DEFAULT_NAME_PLAYER}
                  </strong>
                </div>
                <img
                  key={charData?.image}
                  className="char-page-pc-img"
                  src={charData?.image || Settings.IMAGES.DEFAULT_AVATAR_URL}
                  alt={charData?.name || "NPC portrait"}
                />
                <div className="char-page-desc-wrapper">
                  <i>{charData.description}</i>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="char-page-public-centered-wrap">
                  <Paper
                    className="char-page-paper-center"
                    elevation={12}
                    style={{ paddingBottom: "2em", paddingTop: "1em" }}
                  >
                    <div className="char-page-title char-page-subtitle">
                      Public backstory
                    </div>
                    <MultiLineTextDisplay
                      text={charData?.public}
                      className="char-page-paper-wrapper"
                    />
                  </Paper>
                </div>
              </Grid>
              <Grid item md={12} xs={12}>
                <NotesBanner
                  noteType="npcs"
                  campaignId={campaignId}
                  relatedId={characterId}
                />
              </Grid>
            </Grid>
          </>
        )}
      </form>
    </div>
  );
}

export default NPCPage;
