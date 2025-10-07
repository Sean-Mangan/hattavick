import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./LoreStyle.css";
import { useOutletContext, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateThingMutation,
  useDeleteThingMutation,
  useGetThingQuery,
  useUpdateThingMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import NotesBanner from "../../../Components/Notes/NotesBanner";
import Settings from "../../../config/settings.json";

/**
 * ThingsPage component
 * Displays and manages thing/item lore entries for a campaign
 */
function ThingsPage() {
  // Extract loreId from the URL parameters
  const [searchParams] = useSearchParams();

  // Some helpful hooks to get data
  const { isAdmin, campaignId, error, resetError } = useOutletContext();
  const { data: lore, isLoading } = useGetThingQuery(campaignId);
  const [updateThing] = useUpdateThingMutation({
    fixedCacheKey: "update-thing",
  });
  const [createThing] = useCreateThingMutation({
    fixedCacheKey: "create-thing",
  });
  const [deleteThing] = useDeleteThingMutation({
    fixedCacheKey: "delete-thing",
  });

  // Component state
  const [filteredLore, setFilteredLore] = useState(isLoading ? [] : lore);
  const [delCount, setDelCount] = useState(Settings.UI.DELETE_COUNT_INITIAL);
  const [searchName, setSearchName] = useState("");
  const [selectedLore, setSelectedLore] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [img, setImg] = useState("");

  // Refs for file input and UI elements
  const hiddenCharacterFileInput = useRef(null);

  /**
   * Handles file selection for lore image
   * @param {Event} event - File input change event
   */
  const handleImageChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      setSelectedLore({ ...selectedLore, image: fileUploaded });
      setImg(URL.createObjectURL(fileUploaded));
    }
  };

  /**
   * Triggers the hidden file input click
   */
  const triggerFileInput = () => {
    hiddenCharacterFileInput.current?.click();
  };

  // Refs for UI element manipulation
  const rightRef = useRef();
  const viewerRef = useRef();
  const bodyRef = useRef();

  /**
   * Toggles the right panel visibility
   */
  const showRight = () => {
    rightRef.current?.classList.toggle("show-right");
  };

  /**
   * Toggles the fullscreen image preview
   */
  const closePreview = () => {
    viewerRef.current?.classList.toggle("show-img");
    bodyRef.current?.classList.toggle("no-scroll");
  };

  /**
   * Filters lore items based on search input
   * @param {Event} e - Input change event
   */
  const filterLore = (e) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = lore.filter((lore_item) => {
        return (
          lore_item.name.toLowerCase().includes(keyword.toLowerCase()) &&
          !lore_item.name.includes("Unknown")
        );
      });
      setFilteredLore(results);
    } else {
      setFilteredLore(lore);
    }
    setSearchName(keyword);
  };

  /**
   * Handles creating a new piece of lore
   */
  const createNewLore = async () => {
    try {
      await createThing(campaignId).unwrap();
      setFilteredLore(lore);
      setSearchName("");
    } catch (error) {
      console.error("Failed to create thing:", error);
    }
  };

  /**
   * Handles deleting the selected piece of lore
   * @param {string} lore_id - The ID of the lore item to delete
   */
  const handleDelete = async (lore_id) => {
    if (delCount === Settings.UI.DELETE_COUNT_INITIAL) {
      setDelCount(Settings.UI.DELETE_COUNT_CONFIRM);
    } else {
      try {
        await deleteThing({ campaignId, lore_id }).unwrap();
        setSelectedLore({});
        setDelCount(Settings.UI.DELETE_COUNT_INITIAL);
        setEditMode(!editMode);
        showRight();
      } catch (error) {
        console.error("Failed to delete thing:", error);
      }
    }
  };

  /**
   * Handles updating the selected piece of lore
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const formData = new FormData();
    const updatedImage = selectedLore.image !== img;

    if (updatedImage) {
      formData.append("image", selectedLore.image);
    }
    formData.append("name", selectedLore.name);
    formData.append("private", selectedLore.private);
    formData.append("about", selectedLore.about);
    formData.append("visible", selectedLore.visible);

    // Attempt to perform the things update
    try {
      await updateThing({
        campaignId,
        formData,
        lore_id: selectedLore.lore_id,
      }).unwrap();
      if (updatedImage) {
        setImg(URL.createObjectURL(selectedLore.image));

        // Attempt to copy the lore and update the image of the selected lore
        let newLore = [];
        lore.forEach((elem) => {
          if (elem.lore_id === selectedLore.lore_id) {
            elem = { ...elem, image: URL.createObjectURL(selectedLore.image) };
          }
          newLore.push(elem);
        });
      }
      setEditMode(!editMode);
    } catch (error) {
      console.error("Failed to update thing:", error);
    }
  };

  // In the event of a lore change, reset the filtered data
  useEffect(() => {
    setFilteredLore(lore);
    setSearchName("");
  }, [lore]);

  const previousLoreId = useRef(null);

  useEffect(() => {
    const loreId = searchParams.get("loreId");
    if (loreId && lore) {
      const selected = lore.find((item) => item.lore_id === loreId);
      if (selected && previousLoreId.current !== loreId) {
        setSelectedLore(selected);
        setImg(selected.image);
        previousLoreId.current = loreId; // Update the ref
        showRight();
      }
    } else {
      setSelectedLore({});
      setImg("");
      previousLoreId.current = null; // Reset the ref
    }
  }, [searchParams, lore]);

  return (
    <div className="lore-wrapper" ref={bodyRef}>
      <div className="fullscreen-wrap" ref={viewerRef}>
        <div className="large-img-wrap">
          <img src={img ? img : Settings.IMAGES.DEFAULT_IMAGE} className="preview-img" alt="Fullscreen preview" />
          <CloseIcon
            className="close-img-btn"
            style={{ fontSize: "min(10vw, 48px)", fontWeight: "bold" }}
            onClick={() => closePreview()}
          />
        </div>
      </div>
      <div className="lore-title">Things</div>
      <div className="lore-body-wrap">
        <Paper className="lore-left" elevation={12}>
          <div className="lore-options">
            <TextField label="Search" value={searchName} onChange={filterLore} />
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                className="lore-add-btn"
                onClick={() => createNewLore()}
              >
                <AddIcon />
              </Button>
            )}
          </div>
          <div className="lore-left-wrap">
            {filteredLore.length !== 0 ? (
              filteredLore.map((lore_item) => {
                return (
                  <Card
                    className="lore-item-card"
                    key={lore_item.lore_id}
                    onClick={() => {
                      if (!lore_item?.default) {
                        setSelectedLore(lore_item);
                        setImg(lore_item?.image);
                        setDelCount(0);
                        setEditMode(false);
                        showRight();
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="235"
                      image={
                        lore_item?.image ? lore_item?.image : Settings.IMAGES.DEFAULT_IMAGE
                      }
                      alt="Lore Image"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {lore_item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div>There are no items to display</div>
            )}
          </div>
        </Paper>

        <Paper className="lore-right" elevation={12} ref={rightRef}>
          <form
            onSubmit={(e) => handleSubmit(e)}
            style={{ height: "100%", width: "100%" }}
          >
            <div className="close-btn-wrap">
              <Button onClick={() => showRight()} className="close-btn">
                <CloseIcon
                  style={{ fontSize: "min(10vw, 48px)", fontWeight: "bold" }}
                />
              </Button>
            </div>
            {error && (
              <Alert
                className="campaign_create_err lore-err"
                onClose={() => {
                  resetError();
                }}
                style={{ textAlign: "left" }}
                severity="error"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Oops, an error occurred</strong> — {error}
              </Alert>
            )}
            {isAdmin && selectedLore?.lore_id && (
              <div className="lore-btn-wrap">
                <Button
                  variant="contained"
                  disabled={!editMode}
                  onClick={() => {
                    setSelectedLore({
                      ...selectedLore,
                      visible: !selectedLore?.visible,
                    });
                  }}
                >
                  {selectedLore?.visible ? "visible" : "invisible"}
                </Button>
                <Button
                  variant="contained"
                  disabled={!editMode}
                  color="error"
                  onClick={() => handleDelete(selectedLore?.lore_id)}
                >
                  {delCount === Settings.UI.DELETE_COUNT_INITIAL ? "Delete?" : "Are You Sure?"}
                </Button>

                {editMode ? (
                  <Button
                    key="save-btn"
                    variant="contained"
                    type="submit"
                    color="primary"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    key="edit-btn"
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditMode(!editMode)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}

            {!editMode ? (
              // An item has been selected
              <>
                {selectedLore?.lore_id ? (
                  <>
                    <div className="lore-selected">{selectedLore.name}</div>
                    <div className="selected-wrapper">
                      <img
                        src={img ? img : Settings.IMAGES.DEFAULT_IMAGE}
                        onClick={() => closePreview()}
                        className="selected-image"
                        alt={selectedLore.name}
                      />
                      <div>
                        <strong>About:</strong>
                      </div>
                      <div className="lore-about">
                        <MultiLineTextDisplay text={selectedLore?.about} />
                      </div>

                      {isAdmin && (
                        <div>
                          <div>
                            <strong>Private:</strong>
                          </div>
                          <div className="lore-about">
                            <MultiLineTextDisplay
                              text={selectedLore?.private}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // There has been no selected item yet
                  <div className="lore-mid-wrap">
                    <div className="lore-mid-content">
                      <div className="lore-selected">Things Overview</div>
                      <div className="default-wrapper">
                        <img
                          className="selected-image"
                          src={Settings.IMAGES.THINGS_OVERVIEW_IMAGE_URL}
                          alt="Things overview"
                        />
                        <div className="lore-about">
                          Here be stored information on items of interest;
                          magical items recently discovered, cursed items with
                          an unknown effect, amongst other useful pieces of
                          information.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="lore-edit-wrap">
                <input
                  className="char-page-title char-page-text-field"
                  style={{ fontSize: "50px" }}
                  value={selectedLore.name}
                  onChange={(e) =>
                    setSelectedLore({ ...selectedLore, name: e.target.value })
                  }
                />
                <div className="char-page-editable-container">
                  <img
                    className="char-page-img blur"
                    src={img ? img : Settings.IMAGES.DEFAULT_IMAGE}
                    alt="Thing"
                  />
                  <div className="char-page-upload-btn" onClick={triggerFileInput}>
                    Click to Upload a File
                    <br />
                    <span className="char-page-micro-text">
                      {selectedLore?.image?.name}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={hiddenCharacterFileInput}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div>
                  <strong>About:</strong>
                </div>
                <MultiLineTextField
                  value={selectedLore.about}
                  style={{ textAlign: "center" }}
                  className="lore-page-auto-resize-text char-page-overview"
                  onChange={(value) =>
                    setSelectedLore({ ...selectedLore, about: value })
                  }
                />
                <div>
                  <div>
                    <strong>Private:</strong>
                  </div>
                  <MultiLineTextField
                    value={selectedLore.private}
                    style={{ textAlign: "center" }}
                    className="lore-page-auto-resize-text char-page-overview"
                    onChange={(value) =>
                      setSelectedLore({ ...selectedLore, private: value })
                    }
                  />
                </div>
              </div>
            )}
          </form>
        </Paper>
      </div>
      {selectedLore?.lore_id && (
        <NotesBanner
          campaignId={campaignId}
          noteType={"things"}
          relatedId={selectedLore?.lore_id}
        />
      )}
    </div>
  );
}

export default ThingsPage;
