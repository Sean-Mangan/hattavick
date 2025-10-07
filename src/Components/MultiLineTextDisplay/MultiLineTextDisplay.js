import PropTypes from "prop-types";
import { Link, useOutletContext } from "react-router-dom";
import "./MultiLineTextDisplay.css";
import {
  useGetFactionsQuery,
  useGetLocationQuery,
  useGetNPCDataQuery,
  useGetPartyDataQuery,
  useGetThingQuery,
} from "../../features/campaign/campaignApiSlice";

/**
 * MultiLineTextDisplay component
 * Displays text with support for internal and external links
 * Parses special link syntax: [type|id] where type can be npc, faction, thing, location, pc, or external URL
 *
 * @param {Object} props - Component props
 * @param {string} props.text - Text content to display with optional link syntax
 */
const MultiLineTextDisplay = ({ text }) => {
  const displayText = text || ""; // Ensure text is a string

  const { campaignId, isAdmin } = useOutletContext();
  const { data: allChars } = useGetNPCDataQuery(campaignId);
  const { data: allFactions } = useGetFactionsQuery(campaignId);
  const { data: allThings } = useGetThingQuery(campaignId);
  const { data: allLocations } = useGetLocationQuery(campaignId);
  const { data: allPartyMembers } = useGetPartyDataQuery(campaignId);

  // Create a mapping from the id of the lore item to a url to create a link to it
  const createLink = {};
  allChars?.forEach((char) => {
    createLink[char.character_id] = {
      endpoint: `/campaign/${campaignId}/characters/npc/${char.character_id}`,
      name: char.name,
    };
  });
  allFactions?.forEach((faction) => {
    createLink[faction.lore_id] = {
      endpoint: `/campaign/${campaignId}/lore/factions/?loreId=${faction.lore_id}`,
      name: faction.name,
    };
  });
  allThings?.forEach((thing) => {
    createLink[thing.lore_id] = {
      endpoint: `/campaign/${campaignId}/lore/things/?loreId=${thing.lore_id}`,
      name: thing.name,
    };
  });
  allLocations?.forEach((location) => {
    createLink[location.lore_id] = {
      endpoint: `/campaign/${campaignId}/lore/locations/?loreId=${location.lore_id}`,
      name: location.name,
    };
  });
  allPartyMembers?.forEach((partyMember) => {
    createLink[partyMember.character_id] = {
      endpoint: `/campaign/${campaignId}/characters/pc/${partyMember.character_id}`,
      name: partyMember.name,
    };
  });

  /**
   * Parse text and convert special link syntax to clickable links
   * Supports both internal campaign links and external URLs
   */
  const parseTextToLinks = (text) => {
    const regex = /\[\s*([a-zA-Z0-9_ ]+)\s*\|\s*([^\]]+)\s*\]/g; // Match [ <type> | <id> ] with optional whitespace
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, type, id] = match;
      const startIndex = match.index;

      // Add text before the match
      if (startIndex > lastIndex) {
        const textBeforeMatch = text.slice(lastIndex, startIndex);
        textBeforeMatch.split("\n").forEach((line, index) => {
          parts.push(line);
          if (index < textBeforeMatch.split("\n").length - 1) {
            parts.push(<br key={`br-${startIndex}-${index}`} />);
          }
        });
      }

      if (id.startsWith("http") || id.startsWith("www")) {
        // Create an external link
        parts.push(
          <a
            key={startIndex}
            href={id}
            target="_blank"
            rel="noopener noreferrer"
            className="link-external"
          >
            {type}
          </a>,
        );
      } else if (["thing", "location", "pc", "faction", "npc"].includes(type)) {
        // Create an internal link using the createLink mapping
        const linkData = createLink[id];
        if (linkData) {
          parts.push(
            <Link
              key={startIndex}
              to={linkData.endpoint}
              className={`link-${type}`}
            >
              {linkData.name}
            </Link>,
          );
        } else {
          // If no mapping is found, display the raw text
          parts.push(
            `<Unknown ${type.charAt(0).toUpperCase() + type.slice(1)}>`,
          );
        }
      } else {
        // If the type is invalid, display the raw text
        parts.push("<Unknown Item>");
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text after the last match
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      remainingText.split("\n").forEach((line, index) => {
        parts.push(line);
        if (index < remainingText.split("\n").length - 1) {
          parts.push(<br key={`br-${lastIndex}-${index}`} />);
        }
      });
    }

    return parts;
  };

  return (
    <div className="multi-line-text-display">
      <p className="multi-line-p-content">{parseTextToLinks(displayText)}</p>
    </div>
  );
};

MultiLineTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MultiLineTextDisplay;
