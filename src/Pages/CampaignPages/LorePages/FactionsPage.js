import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./LoreStyle.css";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateFactionMutation,
  useDeleteFactionMutation,
  useGetFactionsQuery,
  useUpdateFactionMutation,
} from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import MultiLineTextField from "../../../Components/MultiLineTextField/MultiLineTextField";
import { Notes } from "@mui/icons-material";
import NotesBanner from "../../../Components/Notes/NotesBanner";

function FactionsPage() {
  // Extract loreId from the URL parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Some helpful hooks to get data
  const { isAdmin, campaignId, error, resetError } = useOutletContext();
  const { data: lore } = useGetFactionsQuery(campaignId);
  const [updateFaction] = useUpdateFactionMutation({
    fixedCacheKey: "update-faction",
  });
  const [createFaction] = useCreateFactionMutation({
    fixedCacheKey: "create-faction",
  });
  const [deleteFaction] = useDeleteFactionMutation({
    fixedCacheKey: "delete-faction",
  });

  // Sate variables
  const [filteredLore, setFilteredLore] = useState(lore);
  const [delCount, setDelCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [selectedLore, setSelectedLore] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [img, setImg] = useState("");

  // Will handle changing the image of the selected loew
  const hiddenCharacterFileInput = React.useRef(null);
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setSelectedLore({ ...selectedLore, image: fileUploaded });
    setImg(URL.createObjectURL(fileUploaded));
  };
  const handleClick = (event) => {
    hiddenCharacterFileInput.current.click();
  };

  // Handle dynamic styling for selecting images
  const rightRef = useRef();
  const viewerRef = useRef();
  const bodyRef = useRef();
  const showRight = () => {
    rightRef.current.classList.toggle("show-right");
  };
  const closePreview = () => {
    viewerRef.current.classList.toggle("show-img");
    bodyRef.current.classList.toggle("no-scroll");
    bodyRef.current.classList.toggle("no-scroll");
  };

  // If no image is given, use this
  const DEFAULT_IMAGE =
    "https://hattavick.s3.us-east-1.amazonaws.com/placeholder.jpg";

  /**
   * Small helper function to filter out all pieces of lore that do not match
   * @param {*} e
   */
  const filter = (e) => {
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
   * Will handle creating a new piece of lore
   */
  const createNewLore = async () => {
    try {
      await createFaction(campaignId).unwrap();
      setFilteredLore(lore);
      setSearchName("");
    } catch {}
  };

  /**
   * Will handle deleting the selected piece of lore
   * @param {*} lore_id
   */
  const handleDelete = async (lore_id) => {
    if (delCount === 0) {
      setDelCount(1);
    } else {
      try {
        await deleteFaction({ campaignId, lore_id }).unwrap();
        setSelectedLore({});
        setDelCount(0);
        setEditMode(!editMode);
        showRight();
      } catch {}
    }
  };

  /**
   * Will handle updating the slected piece of lore
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new image to the form if it changed
    const form_data = new FormData();
    const updatedImage = selectedLore.image !== img;
    if (updatedImage) {
      form_data.append("image", selectedLore.image);
    }
    form_data.append("name", selectedLore.name);
    form_data.append("private", selectedLore.private);
    form_data.append("about", selectedLore.about);
    form_data.append("visible", selectedLore.visible);

    // Attempt to perform the factions update
    try {
      await updateFaction({
        campaignId,
        formData: form_data,
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
    } catch (e) {}
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
          <img src={img ? img : DEFAULT_IMAGE} className="preview-img" />
          <CloseIcon
            className="close-img-btn"
            style={{ fontSize: "min(10vw, 48px)", fontWeight: "bold" }}
            onClick={() => closePreview()}
          />
        </div>
      </div>
      <div className="lore-title">Factions</div>
      <div className="lore-body-wrap">
        <Paper className="lore-left" elevation={12}>
          <div className="lore-options">
            <TextField label="Search" value={searchName} onChange={filter} />
            {isAdmin ? (
              <Button
                variant="contained"
                color="primary"
                className="lore-add-btn"
                onClick={() => createNewLore()}
              >
                <AddIcon />
              </Button>
            ) : (
              <></>
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
                      height="235" // Increase the height (e.g., from 140 to 200)
                      image={
                        lore_item?.image ? lore_item?.image : DEFAULT_IMAGE
                      }
                      alt="Lore Image"
                      style={{ objectFit: "cover" }} // Optional: Ensure the image scales properly
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
            {error ? (
              <Alert
                className="campaign_create_err lore-err"
                onClose={() => {
                  resetError();
                }}
                style={error ? { textAlign: "left" } : { display: "none" }}
                severity="error"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Oops, an error occured</strong> — {error}
              </Alert>
            ) : (
              <></>
            )}
            {isAdmin && selectedLore?.lore_id ? (
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
                  {delCount == 0 ? "Delete?" : "Are You Sure?"}
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
            ) : (
              <></>
            )}

            {!editMode ? (
              // An item has been selected
              <>
                {selectedLore?.lore_id ? (
                  <>
                    <div className="lore-selected">{selectedLore.name}</div>
                    <div className="selected-wrapper">
                      <img
                        src={img ? img : DEFAULT_IMAGE}
                        onClick={() => closePreview()}
                        className="selected-image"
                      />
                      <div>
                        <strong>About:</strong>
                      </div>
                      <div className="lore-about">
                        <MultiLineTextDisplay text={selectedLore?.about} />
                      </div>

                      {isAdmin ? (
                        <>
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
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  // There has been no selected item yet
                  <div className="lore-mid-wrap">
                    <div className="lore-mid-content">
                      <div className="lore-selected">Factions Overview</div>
                      <div className="default-wrapper">
                        <img
                          className="selected-image"
                          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/967c21f0-7dee-4123-84aa-8b2bf2265243/db2we6x-cb977bc4-ac74-4e6e-b93c-8ba13689518c.png/v1/fill/w_1000,h_469,strp/colouyr_mon_by_traceofhatred_db2we6x-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDY5IiwicGF0aCI6IlwvZlwvOTY3YzIxZjAtN2RlZS00MTIzLTg0YWEtOGIyYmYyMjY1MjQzXC9kYjJ3ZTZ4LWNiOTc3YmM0LWFjNzQtNGU2ZS1iOTNjLThiYTEzNjg5NTE4Yy5wbmciLCJ3aWR0aCI6Ijw9MTAwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.xSq9P8OV1HeUW5uQSiwoJgb3DBvcS-tXHw4fn3rgiNQ"
                        />
                        <div className="lore-about">
                          Here you can find information on each faction in the
                          campaign, including reputation, membership amongst
                          other information
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
                    src={img ? img : DEFAULT_IMAGE}
                  />
                  <div className="char-page-upload-btn" onClick={handleClick}>
                    Click to Upload a File
                    <br />
                    <a className="char-page-micro-text">
                      {selectedLore?.image?.name}
                    </a>
                  </div>
                  <input
                    type="file"
                    ref={hiddenCharacterFileInput}
                    onChange={handleChange}
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
          noteType={"factions"}
          relatedId={selectedLore?.lore_id}
        />
      )}
    </div>
  );
}

export default FactionsPage;
