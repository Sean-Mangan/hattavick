import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./CampaignHomePage.css";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { TextareaAutosize } from "@mui/material";
import {
  useGetCampaignHomeDataQuery,
  useUpdateHomePageMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";

function CampaignHomePage() {
  // Get homepage data
  const { campaignId, isAdmin } = useOutletContext();
  const { data, isLoading, isSuccess, isError } =
    useGetCampaignHomeDataQuery(campaignId);

  // Set the data in state to make it editable
  const [homeData, setHomeData] = useState(data);
  const [img, setImg] = useState(homeData?.img);

  // Hooks for updating the data
  const [updateHomeData] = useUpdateHomePageMutation({
    fixedCacheKey: "update-home",
  });

  // Some helpful state vars
  const [err, setErr] = useState("");
  const [editMode, setEditMode] = useState(false);
  const hiddenFileInput = React.useRef(null);

  /**
   * Will attempt to send an update request for the campaign
   * @param {*} e the click event, dummy
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const form_data = new FormData();
    if (homeData.img !== img) {
      form_data.append("image", homeData.img);
    }
    form_data.append("campaign_name", homeData.campaign_name);
    form_data.append("data", homeData.data);

    // Attempt to perform the update
    try {
      await updateHomeData({ formData: form_data, id: campaignId }).unwrap();
      setEditMode(!editMode);
      setImg(URL.createObjectURL(homeData.img));
    } catch (err) {
      setErr(err?.response?.data?.error);
    }
  };

  // Extract the file, and set the image as src
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setHomeData({ ...homeData, img: fileUploaded });
    setImg(URL.createObjectURL(fileUploaded));
  };

  // Lets hecking prompt a image to upload
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="campaign-home-wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="home-button-wrapper">
          {isAdmin && homeData?.campaign_name !== "" ? (
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
            <div className="homepage-title">{homeData.campaign_name}</div>
            {homeData?.img ? <img className="img-wrapper" src={img} /> : <></>}
            <MultiLineTextDisplay
              className="homepage-overview"
              style={{ width: "800px" }}
              text={homeData.data}
            />
          </>
        ) : (
          <>
            <input
              className="homepage-title text-field"
              value={homeData.campaign_name}
              onChange={(e) =>
                setHomeData({ ...homeData, campaign_name: e.target.value })
              }
            />
            <div className="editable-container">
              <img className="img-wrapper blur" src={img} />
              <div className="upload-btn" onClick={handleClick}>
                Click to Upload a File
                <br />
                <a className="micro-text">{homeData?.img?.name}</a>
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
              value={homeData.data}
              onChange={(value) => setHomeData({ ...homeData, data: value })}
              placeholder="Write the world backstory here..."
            />
          </>
        )}
      </form>
    </div>
  );
}

export default CampaignHomePage;
