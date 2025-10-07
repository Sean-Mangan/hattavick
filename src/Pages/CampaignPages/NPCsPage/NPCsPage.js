import { Button, Card, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import "./NPCsPage.css";
import {
  useCreateNewNPCMutation,
  useGetNPCDataQuery,
} from "../../../features/campaign/campaignApiSlice";
import Settings from "../../../config/settings.json";

function NPCsPage() {
  // Context and navigation hooks
  const { campaignId, isAdmin } = useOutletContext();
  const navigate = useNavigate();

  // Fetch NPC data for this campaign
  const { data: allChars } = useGetNPCDataQuery(campaignId);

  // Mutation for creating new NPCs
  const [createNewNPC] = useCreateNewNPCMutation({
    fixedCacheKey: "create-npc",
  });

  // Local state for filtering and search
  const [chars, setChars] = useState(allChars);
  const [name, setName] = useState("");

  /**
   * Creates a new NPC and navigates to its detail page
   */
  const createNPC = async () => {
    try {
      const result = await createNewNPC(campaignId).unwrap();
      navigate(`/campaign/${campaignId}/characters/npc/${result.character_id}`);
    } catch (error) {
      console.error("Failed to create NPC:", error);
    }
  };

  /**
   * Filters NPCs based on search input
   * @param {Event} e - Input change event
   */
  const filterNPCs = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      // Filter characters by name, excluding "Unknown" entries
      const results = allChars.filter((char) => {
        return (
          char.name.toLowerCase().includes(keyword.toLowerCase()) &&
          !char.name.includes("Unknown")
        );
      });
      setChars(results);
    } else {
      setChars(allChars);
    }
    setName(keyword);
  };

  /**
   * Renders a single NPC card with basic information
   * @param {Object} char - NPC character data
   */
  const CharacterRow = ({ char }) => {
    const displayName = char.name === "Unknown" ? "Unknown Name" : char.name;
    const displayLocation = char.location || "Unknown Location";
    const displayDescription = char.description
      ? char.description.slice(0, 200) + "..."
      : "You have not met this character yet";

    return (
      <div>
        <Link
          to={
            char?.character_id
              ? `/campaign/${campaignId}/characters/npc/${char.character_id}`
              : "#"
          }
          style={{ textDecoration: "none" }}
        >
          <Card variant="outlined" className="row_wrapper button">
            <div className="icon_wrapper">
              <img
                className="npc_icon"
                src={char.image || Settings.IMAGES.DEFAULT_AVATAR_URL}
                alt={displayName}
              />
            </div>
            <div className="npc_data_wrapper">
              <div className="content_center">
                <h4 className="character_name">{displayName}</h4>
                <h4 className="character_header">{displayLocation}</h4>
                <p className="character_header blurb">{displayDescription}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    );
  };

  // Reset filter when NPC data changes
  useEffect(() => {
    setChars(allChars);
    setName("");
  }, [allChars]);

  return (
    <div className="npcs-wrapper">
      <div className="npc-title">All NPCs</div>
      <div className="npc-page-form-wrap">
        {isAdmin && (
          <Button
            className="npcs-btn"
            variant="contained"
            color="error"
            onClick={createNPC}
            startIcon={<AddIcon />}
          >
            Add NPC
          </Button>
        )}
        <TextField
          className="npc_search"
          type="search"
          value={name}
          onChange={filterNPCs}
          placeholder="Search Name"
        />
      </div>
      {chars.map((char) => {
        return <CharacterRow char={char} key={char.character_id} />;
      })}
    </div>
  );
}

export default NPCsPage;
