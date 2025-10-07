import { SaveOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import "./WorldLorePage.css";
import {
  useGetWorldLoreQuery,
  useUpdateWorldLoreMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import NotesBanner from "../../../Components/Notes/NotesBanner";

function WorldLorePage() {
  // Context and API hooks
  const { campaignId, isAdmin } = useOutletContext();
  const { data: world } = useGetWorldLoreQuery(campaignId);
  const [updateWorldLore] = useUpdateWorldLoreMutation({
    fixedCacheKey: "update-world-lore",
  });

  // Component state
  const [worldData, setWorldData] = useState(world);
  const [img, setImg] = useState(world?.img);
  const [editMode, setEditMode] = useState(false);

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Update worldData when API data loads
  useEffect(() => {
    if (world) {
      setWorldData(world);
      setImg(world.img);
    }
  }, [world]);

  /**
   * Handles file selection and preview
   * @param {Event} event - File input change event
   */
  const handleImageChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      setWorldData({ ...worldData, img: fileUploaded });
      setImg(URL.createObjectURL(fileUploaded));
    }
  };

  /**
   * Triggers the hidden file input click
   */
  const triggerFileInput = () => {
    hiddenFileInput.current?.click();
  };

  /**
   * Handles form submission to update world lore data
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData payload
    const formData = new FormData();
    const hasImageChanged = worldData.img !== img;

    // Only include image if it has changed
    if (hasImageChanged) {
      formData.append("image", worldData.img);
    }
    formData.append("campaign_name", worldData.campaign_name);
    formData.append("data", worldData.data);

    // Submit updates to the backend
    try {
      await updateWorldLore({ campaignId, formData }).unwrap();
      if (hasImageChanged) {
        setImg(URL.createObjectURL(worldData.img));
      }
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update world lore:", error);
    }
  };

  return (
    <div className="campaign-home-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="home-button-wrapper">
          {isAdmin &&
            (editMode ? (
              <Button
                type="submit"
                className="edit-btn"
                variant="contained"
                endIcon={<SaveOutlined />}
              >
                Save
              </Button>
            ) : (
              <Button
                className="edit-btn"
                variant="contained"
                color="error"
                endIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            ))}
        </div>
        {!editMode ? (
          <>
            <div className="homepage-title">World Lore</div>
            {worldData?.img && (
              <img className="img-wrapper" src={img} alt="World lore" />
            )}
            <MultiLineTextDisplay
              text={worldData?.data}
              className="homepage-overview"
            />
          </>
        ) : (
          <>
            <div className="homepage-title">World Lore</div>
            <div className="editable-container">
              <img
                className="img-wrapper blur"
                src={img}
                alt="World lore preview"
              />
              <div className="upload-btn" onClick={triggerFileInput}>
                Click to Upload a File
                <br />
                <span className="micro-text">{worldData?.img?.name}</span>
              </div>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
            <MultiLineTextField
              style={{ width: "800px" }}
              value={worldData.data}
              className="homepage-overview auto_resize_text"
              onChange={(value) => setWorldData({ ...worldData, data: value })}
            />
          </>
        )}
      </form>
      <NotesBanner
        campaignId={campaignId}
        noteType={"world_page"}
        relatedId={"world_page"}
      />
    </div>
  );
}

export default WorldLorePage;
