import { SaveOutlined } from "@mui/icons-material";
import {
  Button,
  Grid,
  Paper,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
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

function NPCPage() {
  // Get campaign id and if the user is an admin
  const { campaignId, isAdmin } = useOutletContext();

  // Hooks to get some helpful info
  const [updateNPC] = useUpdateNPCMutation({ fixedCacheKey: "update-npc" });
  const [deleteNPC] = useDeleteNPCMutation({ fixedCacheKey: "delete-npc" });
  const navigate = useNavigate();
  const { characterId } = useParams();

  // Get all characters and filter down to the npc in question
  const { data: npcs } = useGetNPCDataQuery(campaignId);
  const filteredNPCs = npcs.filter(
    (character) => character.character_id === characterId,
  );
  const npc = filteredNPCs.length === 1 ? filteredNPCs[0] : {};

  // Some state variables to handle UI
  const [charData, setCharData] = useState(npc);
  const [img, setImg] = useState(npc.image);
  const [delCount, setDelCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  // Fun stuff to handle image manipulation
  const hiddenCharacterFileInput = React.useRef(null);
  const notGiven =
    "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png";
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setCharData({ ...charData, image: fileUploaded });
    setImg(URL.createObjectURL(fileUploaded));
  };
  const handleClick = (event) => {
    hiddenCharacterFileInput.current.click();
  };

  /**
   * Will handle updating the given NPC
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const form_data = new FormData();
    const updateImage = charData.image !== img;
    if (charData.img !== img) {
      form_data.append("image", charData.image);
    }
    form_data.append("name", charData.name);
    form_data.append("backstory", charData.backstory);
    form_data.append("description", charData.description);
    form_data.append("public", charData.public);
    form_data.append("name", charData.name);
    form_data.append("visible", charData.visible);
    form_data.append("job", charData.job);
    form_data.append("location", charData.location);

    // Attempt to perform the update
    try {
      await updateNPC({
        campaignId,
        characterId,
        formData: form_data,
      }).unwrap();
      setDelCount(0);
      setEditMode(!editMode);
      if (updateImage) setImg(URL.createObjectURL(charData.image));
    } catch {}
  };

  /**
   * Will handle deleting the current character
   */
  const handleDelete = async () => {
    if (delCount == 0) {
      setDelCount(1);
    } else {
      try {
        await deleteNPC({ campaignId, characterId }).unwrap();
        navigate(`/campaign/${campaignId}/characters/npcs`);
      } catch {}
    }
  };

  // Reset the char when their are edits made
  useEffect(() => {
    setCharData(npc);
  }, [npc]);

  return (
    <div className="pc-wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
        {isAdmin ? (
          <>
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
                {delCount == 0 ? "Delete?" : "Are you Sure?"}
              </Button>
              {editMode ? (
                <Button
                  key={"save"}
                  type="submit"
                  className="char-page-edit-btn"
                  variant="contained"
                  endIcon={<SaveOutlined />}
                >
                  Save
                </Button>
              ) : (
                <Button
                  key={"edit"}
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
                      {charData?.name ? charData?.name : "Unknown"}
                    </strong>
                  </div>
                  <img
                    key={img}
                    className="char-page-pc-img"
                    src={img ? img : notGiven}
                  />
                  <div className="sm-menu-wrapper">
                    <strong>Location:</strong> {charData.location}
                    <br />
                    <strong>job:</strong> {charData.job}
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
                    noteType={"npcs"}
                    campaignId={campaignId}
                    relatedId={characterId}
                  />
                </Grid>
              </Grid>
            ) : (
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
                      src={img ? img : notGiven}
                    />
                    <div className="char-page-upload-btn" onClick={handleClick}>
                      Click to Upload a File
                      <br />
                      <a className="char-page-micro-text">
                        {charData?.image?.name}
                      </a>
                    </div>
                    <input
                      type="file"
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
                        placeholder="Write the public backstory here..."
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
                    noteType={"npcs"}
                    campaignId={campaignId}
                    relatedId={characterId}
                  />
                </Grid>
              </Grid>
            )}
          </>
        ) : (
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
                    {charData?.name ? charData?.name : "Not Named"}
                  </strong>
                </div>
                <img
                  key={charData?.image}
                  className="char-page-pc-img"
                  src={charData?.image ? charData.image : notGiven}
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
                    <MultiLineTextDisplay text={charData?.public} className="char-page-paper-wrapper"/>
                  </Paper>
                </div>
              </Grid>
              <Grid item md={12} xs={12}>
                <NotesBanner
                  noteType={"npcs"}
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
