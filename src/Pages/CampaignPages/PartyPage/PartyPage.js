import { useState } from "react";
import "./PartyPage.css";
import { Link, useParams } from "react-router-dom";
import { Grid, Hidden, Paper } from "@mui/material";
import { v4 } from "uuid";
import { useGetPartyDataQuery } from "../../../features/campaign/campaignApiSlice";
import Settings from "../../../config/settings.json";

/**
 * PartyPage component displays all party members in a campaign.
 * Shows character portraits and descriptions in an alternating layout.
 *
 * @returns {JSX.Element} The party page with character listings
 */
function PartyPage() {
  // Get campaign data
  const { campaignId } = useParams();
  const {
    data: party,
    isLoading: partyLoading,
    isSuccess: partySuccess,
    isError: partyError,
  } = useGetPartyDataQuery(campaignId);

  // Set state variables for characters and error
  const [charData, setCharData] = useState(party);
  const [error, setError] = useState("");

  /**
   * CharacterRow component displays a single character's information.
   * Alternates layout based on index for visual variety.
   *
   * @param {Object} props - Component props
   * @param {Object} props.character - Character data to display
   * @param {number} props.idx - Index of character in the list
   * @returns {JSX.Element} The character row
   */
  const CharacterRow = ({ character, idx }) => {
    const truncatedDescription =
      character.description.substring(
        0,
        Settings.VALIDATION.MAX_DESCRIPTION_LENGTH,
      ) + "...";

    return (
      <Paper elevation={12} className="character-party-wrapper">
        <Grid container>
          {/* Even index: Image on left, description on right */}
          {idx % 2 === 0 ? (
            <>
              <Grid item xs={12} md={6}>
                <div className="title-img-wrapper">
                  <div className="char-name-title">{character.name}</div>
                  <div className="char-img-wrapper">
                    <img
                      alt={character.name || "Party member portrait"}
                      className="char-party-img"
                      src={character.image}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="title-desc-wrapper">
                  <div className="title-desc-text">
                    <i>{truncatedDescription}</i>
                  </div>
                </div>
              </Grid>
            </>
          ) : (
            /* Odd index: Description on left (desktop), image on right */
            <>
              {/* Desktop view - description on left */}
              <Hidden mdDown>
                <Grid item xs={12} md={6}>
                  <div className="title-desc-wrapper">
                    <div className="title-desc-text">
                      <i>{truncatedDescription}</i>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="title-img-wrapper">
                    <div className="char-name-title">{character.name}</div>
                    <div className="char-img-wrapper">
                      <img
                        alt={character.name || "Party member portrait"}
                        className="char-party-img"
                        src={character.image}
                      />
                    </div>
                  </div>
                </Grid>
              </Hidden>

              {/* Mobile view - image on top */}
              <Hidden mdUp>
                <Grid item xs={12} md={6}>
                  <div className="title-img-wrapper">
                    <div className="char-name-title">{character.name}</div>
                    <div className="char-img-wrapper">
                      <img
                        alt={character.name || "Party member portrait"}
                        className="char-party-img"
                        src={character.image}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="title-desc-wrapper">
                    <div className="title-desc-text">
                      <i>{truncatedDescription}</i>
                    </div>
                  </div>
                </Grid>
              </Hidden>
            </>
          )}
        </Grid>
      </Paper>
    );
  };

  return (
    <div>
      <div className="party-title">Party</div>
      {charData.map((char, idx) => (
        <Link
          key={v4()}
          style={{ textDecoration: "None" }}
          to={
            char.character_id
              ? `/campaign/${campaignId}/characters/pc/${char.character_id}`
              : "#"
          }
        >
          <CharacterRow key={v4()} character={char} idx={idx} />
        </Link>
      ))}
    </div>
  );
}

export default PartyPage;
