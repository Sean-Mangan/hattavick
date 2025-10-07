import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import "./CampaignHomePage.css";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import {
  useGetCampaignHomeDataQuery,
  useUpdateHomePageMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import NotesBanner from "../../../Components/Notes/NotesBanner";
import SystemNotificationWrapper from "../../../Components/SystemNotificationWrapper/SystemNotificationWrapper";
import Settings from "../../../config/settings.json";

/**
 * CampaignHomePage component
 * Displays and allows editing of the campaign home page content
 */
function CampaignHomePage() {
  // Context and API hooks
  const { campaignId, isAdmin } = useOutletContext();
  const { data } = useGetCampaignHomeDataQuery(campaignId);

  // API mutation for updating homepage
  const [updateHomeData] = useUpdateHomePageMutation({
    fixedCacheKey: "update-home",
  });

  // Component state
  const [homeData, setHomeData] = useState(data);
  const [img, setImg] = useState(homeData?.img);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Update image preview when homeData changes
  useEffect(() => {
    setImg(homeData?.img || Settings.IMAGES.DEFAULT_HOME_IMAGE);
  }, [homeData]);

  /**
   * Handles form submission to update campaign home page
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData payload
    const formData = new FormData();
    const hasImageChanged = homeData.img !== img;

    // Only include image if it has changed
    if (hasImageChanged) {
      formData.append("image", homeData.img);
    }
    formData.append("campaign_name", homeData.campaign_name);
    formData.append("data", homeData.data);

    // Submit updates to the backend
    try {
      await updateHomeData({ formData, id: campaignId }).unwrap();
      setEditMode(false);
      if (hasImageChanged) {
        setImg(URL.createObjectURL(homeData.img));
      }
    } catch (err) {
      console.error("Failed to update home page:", err);
      setError(
        err?.response?.data?.error ||
          "Failed to update home page. Please try again."
      );
    }
  };

  /**
   * Handles file selection and preview
   * @param {Event} event - File input change event
   */
  const handleImageChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      setHomeData({ ...homeData, img: fileUploaded });
      setImg(URL.createObjectURL(fileUploaded));
    }
  };

  /**
   * Triggers the hidden file input click
   */
  const triggerFileInput = () => {
    hiddenFileInput.current?.click();
  };

  return (
    <div className="campaign-home-wrapper">
      <SystemNotificationWrapper />
      <form onSubmit={handleSubmit}>
        <div className="home-button-wrapper">
          {isAdmin &&
            homeData?.campaign_name &&
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
                type="button"
                className="edit-btn"
                variant="contained"
                color="error"
                endIcon={<EditIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditMode(true);
                }}
              >
                Edit
              </Button>
            ))}
        </div>
        {!editMode ? (
          <>
            {/* Display mode */}
            <div className="homepage-title">{homeData.campaign_name}</div>
            <img
              className="img-wrapper"
              src={homeData?.img ? img : Settings.IMAGES.DEFAULT_HOME_IMAGE}
              alt={homeData.campaign_name || "Campaign home"}
            />
            <MultiLineTextDisplay
              className="homepage-overview"
              style={{ width: "800px" }}
              text={homeData.data}
            />
          </>
        ) : (
          <>
            {/* Edit mode */}
            <input
              className="homepage-title text-field"
              value={homeData.campaign_name}
              onChange={(e) =>
                setHomeData({ ...homeData, campaign_name: e.target.value })
              }
            />
            <div className="editable-container">
              <img
                className="img-wrapper blur"
                src={img || Settings.IMAGES.DEFAULT_HOME_IMAGE}
                alt="Campaign preview"
              />
              <div className="upload-btn" onClick={triggerFileInput}>
                Click to Upload a File
                <br />
                <span className="micro-text">
                  {homeData?.img?.name || "No file chosen"}
                </span>
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
              value={homeData.data}
              onChange={(value) => setHomeData({ ...homeData, data: value })}
              placeholder="Write the world backstory here..."
            />
          </>
        )}
      </form>
      <div className="notes-banner">
        <NotesBanner
          campaignId={campaignId}
          noteType={"home_page"}
          relatedId={"home_page"}
        />
      </div>
    </div>
  );
}

export default CampaignHomePage;
