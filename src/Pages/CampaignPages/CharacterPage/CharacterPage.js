import { Grid, Paper } from "@mui/material";
import React from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import "./CharacterPage.css";
import { useGetPartyDataQuery } from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import NotesBanner from "../../../Components/Notes/NotesBanner";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/auth/authSlice";
import { useEffect } from "react";

function PlayerCharacterPage() {
  // Get campaign id and if the user is an admin
  const { campaignId, isAdmin } = useOutletContext();
  const { characterId } = useParams();
  const navigate = useNavigate();

  // determine thew user id
  const userId = useSelector(selectCurrentUserId);

  // Get the character in question and display the info
  const {
    data: party,
    isLoading: partyLoading,
    isSuccess: partySuccess,
    isError: partyError,
  } = useGetPartyDataQuery(campaignId);
  const filteredCharacters = party.filter(
    (character) => character.character_id === characterId,
  );
  const character =
    filteredCharacters.length === 1 ? filteredCharacters[0] : {};
  const notGiven =
    "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png";

  let contentSpacing = isAdmin || userId === character?.user_id ? "4" : "6";

  useEffect(() => {
    // If the user id matches the owner, redirect them to the my character page
    if (userId === character?.user_id) {
      navigate(`/campaign/${campaignId}/my-character`);
    }
  }, [userId, character?.user_id, campaignId, navigate]);

  return (
    <div className="pc-wrapper">
      <div className="char-page-pc-space" />
      <Grid container spacing={2}>
        <Grid item xs={12} md={contentSpacing}>
          <div
            className="char-page-title"
            style={{ fontSize: "40px", letterSpacing: "-3px", marginTop: "0" }}
          >
            <strong>{character?.name ? character?.name : "Not Named"}</strong>
          </div>
          <img
            className="char-page-pc-img"
            src={character?.image ? character.image : notGiven}
          />
          <div className="char-page-desc-wrapper">
            <i>{character.description}</i>
          </div>
        </Grid>
        <Grid item xs={12} md={contentSpacing}>
          <div className="char-page-public-centered-wrap">
            <Paper
              className="char-page-paper-center"
              elevation={12}
              style={{ paddingBottom: "2em", paddingTop: "1em" }}
            >
              <div className="char-page-title char-page-subtitle">
                Public backstory
              </div>
              <div className="char-page-paper-wrapper">
                <MultiLineTextDisplay text={character?.public} />
              </div>
            </Paper>
          </div>
        </Grid>

        {
          // If the user is an admin or the owner of the character, show the private backstory
          (isAdmin || userId === character?.user_id) && (
            <Grid item xs={12} md={contentSpacing}>
              <div className="char-page-public-centered-wrap">
                <Paper
                  className="char-page-paper-center"
                  elevation={12}
                  style={{ paddingBottom: "2em", paddingTop: "1em" }}
                >
                  <div className="char-page-title char-page-subtitle">
                    Public backstory
                  </div>
                  <div className="char-page-paper-wrapper">
                    <MultiLineTextDisplay text={character?.backstory} />
                  </div>
                </Paper>
              </div>
            </Grid>
          )
        }
        <Grid item md={12}>
          <NotesBanner
            campaignId={campaignId}
            noteType={"characters"}
            relatedId={characterId}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlayerCharacterPage;
