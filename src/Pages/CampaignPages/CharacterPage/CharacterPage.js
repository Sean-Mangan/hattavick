import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import "./CharacterPage.css";
import { useGetPartyDataQuery } from "../../../features/campaign/campaignApiSlice";
import MultiLineTextDisplay from "../../../Components/MultiLineTextDisplay/MultiLineTextDisplay";
import NotesBanner from "../../../Components/Notes/NotesBanner";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/auth/authSlice";
import Settings from "../../../config/settings.json";

/**
 * PlayerCharacterPage component
 * Displays a player character's public and private backstory
 * Redirects to "my character" page if viewing own character
 */
function PlayerCharacterPage() {
  // Context and navigation hooks
  const { campaignId, isAdmin } = useOutletContext();
  const { characterId } = useParams();
  const navigate = useNavigate();

  // Get current user ID
  const userId = useSelector(selectCurrentUserId);

  // Fetch party data to find the character
  const { data: party } = useGetPartyDataQuery(campaignId);

  // Find the specific character from party data
  const filteredCharacters = party.filter(
    (character) => character.character_id === characterId
  );
  const character =
    filteredCharacters.length === 1 ? filteredCharacters[0] : {};

  // Determine if user can see private backstory (admin or character owner)
  const canViewPrivate = isAdmin || userId === character?.user_id;

  // Calculate grid spacing based on whether private backstory is shown
  const contentSpacing = canViewPrivate ? "4" : "6";

  // Redirect to "my character" page if user is viewing their own character
  useEffect(() => {
    if (userId === character?.user_id) {
      navigate(`/campaign/${campaignId}/characters/mycharacter`);
    }
  }, [userId, character?.user_id, campaignId, navigate]);

  // Display values with fallbacks
  const displayName = character?.name || "Not Named";
  const displayImage = character?.image || Settings.IMAGES.DEFAULT_AVATAR_URL;

  return (
    <div className="pc-wrapper">
      <div className="char-page-pc-space" />
      <Grid container spacing={2}>
        {/* Character header section */}
        <Grid item xs={12} md={contentSpacing}>
          <div className="char-page-title char-page-main-title">
            <strong>{displayName}</strong>
          </div>
          <img
            className="char-page-pc-img"
            src={displayImage}
            alt={displayName}
          />
          <div className="char-page-desc-wrapper">
            <i>{character.description}</i>
          </div>
        </Grid>

        {/* Private backstory section - only shown to admins or character owner */}
        {canViewPrivate && (
          <Grid item xs={12} md={contentSpacing}>
            <div className="char-page-public-centered-wrap">
              <Paper
                className="char-page-paper-center"
                elevation={12}
                style={{ paddingBottom: "2em", paddingTop: "1em" }}
              >
                <div className="char-page-title char-page-subtitle">
                  Private backstory
                </div>
                <div className="char-page-paper-wrapper">
                  <MultiLineTextDisplay text={character?.backstory} />
                </div>
              </Paper>
            </div>
          </Grid>
        )}

        {/* Public backstory section - visible to all players */}
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

        {/* Notes section */}
        <Grid item md={12}>
          <NotesBanner
            campaignId={campaignId}
            noteType="characters"
            relatedId={characterId}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlayerCharacterPage;
