import { SaveOutlined } from "@mui/icons-material";
import { Button, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  useGetWorldLoreQuery,
  useUpdateWorldLoreMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import NotesBanner from "../../../Components/Notes/NotesBanner";

function WorldLorePage() {
  // GSome helpful hooks to get world data and manipulation mutations
  const { campaignId, isAdmin } = useOutletContext();
  const { data: world } = useGetWorldLoreQuery(campaignId);
  const [updateWorldLore] = useUpdateWorldLoreMutation({
    fixedCacheKey: "update-world-lore",
  });

  // Some helpful state content
  const [worldData, setWorldData] = useState(world);
  const [img, setImg] = useState(world?.img);
  const [editMode, setEditMode] = useState(false);

  // Some helpful utils for handling file changes
  const hiddenFileInput = React.useRef(null);
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setWorldData({ ...worldData, img: fileUploaded });
    setImg(URL.createObjectURL(fileUploaded));
  };
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  /**
   * Will handle formatting the payload to send the updated world lore data to the backend
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const form_data = new FormData();
    const updateImage = worldData.img !== img;
    if (updateImage) {
      form_data.append("image", worldData.img);
    }
    form_data.append("campaign_name", worldData.campaign_name);
    form_data.append("data", worldData.data);

    // Attempt to send the new world lore data to the backend
    try {
      await updateWorldLore({ campaignId, formData: form_data }).unwrap();
      if (updateImage) setImg(URL.createObjectURL(worldData.img));
      setEditMode(!editMode);
    } catch {}
  };

  return (
    <div className="campaign-home-wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="home-button-wrapper">
          {isAdmin && worldData?.campaign_name !== "" ? (
            editMode ? (
              <Button
                key={"save"}
                type="submit"
                className="edit-btn"
                variant="contained"
                endIcon={<SaveOutlined />}
              >
                Save
              </Button>
            ) : (
              <Button
                key={"edit"}
                className="edit-btn"
                variant="contained"
                color="error"
                endIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
              >
                Edit
              </Button>
            )
          ) : (
            <></>
          )}
        </div>
        {!editMode ? (
          <>
            <div className="homepage-title">World Lore</div>
            {worldData?.img ? <img className="img-wrapper" src={img} /> : <></>}
            <MultiLineTextDisplay
              text={worldData?.data}
              className="homepage-overview"
            />
          </>
        ) : (
          <>
            <div className="homepage-title">World Lore</div>
            <div className="editable-container">
              <img className="img-wrapper blur" src={img} />
              <div className="upload-btn" onClick={handleClick}>
                Click to Upload a File
                <br />
                <a className="micro-text">{worldData?.img?.name}</a>
              </div>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: "none" }}
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
