import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./MyCharacterPage.css";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, Paper, TextareaAutosize } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import {
  useGetMyCharacterDataQuery,
  useUpdateMyCharacterMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import Settings from "../../../config/settings.json";

/**
 * MyCharacterPage component for managing the user's character in a D&D campaign.
 * Allows users to view and edit their character's name, image, description, and backstory.
 *
 * @returns {JSX.Element} The character management page
 */
function MyCharacterPage() {
  // Grab campaign id
  const { campaignId } = useParams();

  // Get character data
  const {
    data: myChar,
    isLoading: myCharLoading,
    isSuccess: myCharSuccess,
    isError: myCharError,
  } = useGetMyCharacterDataQuery(campaignId);

  // State variables for character, image and editability
  const [charData, setCharData] = useState(myChar);
  const [img, setImg] = useState(charData?.image);
  const [editMode, setEditMode] = useState(false);

  // Mutation for handling character updates
  const [updateMyCharacter] = useUpdateMyCharacterMutation({
    fixedCacheKey: "update-my-char",
  });

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
   * Handles the character update submission
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const formData = new FormData();
    const updateImage = charData.image !== img;
    if (updateImage) {
      formData.append("image", charData.image);
    }
    formData.append("campaign_name", charData.name);
    formData.append("backstory", charData.backstory);
    formData.append("description", charData.description);
    formData.append("public", charData.public);
    formData.append("name", charData.name);

    // Attempt to perform the update
    try {
      await updateMyCharacter({ formData: formData, id: campaignId }).unwrap();
      setEditMode(!editMode);
      if (updateImage) setImg(URL.createObjectURL(charData.image));
    } catch (error) {
      console.error("Failed to update character:", error);
    }
  };

  return (
    <div className="pc-wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* Edit/Save Button */}
        <div className="btn-wrapper">
          {editMode ? (
            <Button
              key="save"
              type="submit"
              className="char-edit-btn"
              variant="contained"
              endIcon={<SaveOutlined />}
            >
              Save
            </Button>
          ) : (
            <Button
              key="edit"
              className="char-edit-btn"
              variant="contained"
              color="error"
              endIcon={<EditIcon />}
              onClick={() => setEditMode(!editMode)}
            >
              Edit
            </Button>
          )}
        </div>

        {/* Display mode */}
        {!editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div
                className="my-char-title"
                style={{
                  fontSize: "40px",
                  letterSpacing: "-3px",
                  marginTop: "0",
                }}
              >
                <strong>
                  {charData?.name || Settings.DEFAULTS.DEFAULT_CHARACTER_NAME}
                </strong>
              </div>
              {charData?.image && (
                <img
                  className="char-img"
                  src={img}
                  alt={charData?.name || "Character portrait"}
                />
              )}

              <div className="desc-wrapper">
                <i>{charData.description}</i>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{ paddingBottom: "2em" }}>
                <div className="my-char-title my-char-subtitle">
                  Private backstory
                </div>
                <div className="char-page-paper-wrapper">
                  <MultiLineTextDisplay text={charData?.backstory} />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{ paddingBottom: "2em" }}>
                <div className="my-char-title my-char-subtitle">
                  Public backstory
                </div>
                <div className="char-page-paper-wrapper">
                  <MultiLineTextDisplay text={charData?.public} />
                </div>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          /* Edit mode */
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <input
                className="my-char-title text-field"
                style={{ fontSize: "40px", letterSpacing: "-3px" }}
                value={charData?.name}
                onChange={(e) =>
                  setCharData({ ...charData, name: e.target.value })
                }
              />
              <div className="editable-container">
                <img
                  className="char-img blur"
                  src={img}
                  alt={charData?.name || "Character portrait"}
                />
                <div className="upload-btn" onClick={handleClick}>
                  Click to Upload a File
                  <br />
                  <span className="micro-text">{charData?.image?.name}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={hiddenCharacterFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="desc-wrapper">
                <TextareaAutosize
                  value={charData.description}
                  style={{ textAlign: "center" }}
                  className="auto_resize_text mychar-overview"
                  onChange={(e) =>
                    setCharData({ ...charData, description: e.target.value })
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{ paddingBottom: "2em" }}>
                <div className="my-char-title my-char-subtitle">
                  Private backstory
                </div>
                <div className="paper-wrappper">
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
              <Paper elevation={12} style={{ paddingBottom: "2em" }}>
                <div className="my-char-title my-char-subtitle">
                  Public backstory
                </div>
                <div className="paper-wrappper">
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
          </Grid>
        )}
      </form>
    </div>
  );
}

export default MyCharacterPage;
