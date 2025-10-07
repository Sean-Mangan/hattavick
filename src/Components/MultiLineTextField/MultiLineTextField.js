import { useRef, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  useGetFactionsQuery,
  useGetLocationQuery,
  useGetNPCDataQuery,
  useGetPartyDataQuery,
  useGetThingQuery,
} from "../../features/campaign/campaignApiSlice";
import { useOutletContext } from "react-router-dom";

/**
 * MultiLineTextField component
 * Text field with autocomplete for campaign entities (NPCs, factions, things, locations, party members)
 * Supports @ mentions and external URL linking
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current text value
 * @param {Function} props.onChange - Callback when text changes
 * @param {string} props.placeholder - Placeholder text
 */
const MultiLineTextField = ({ value, onChange, placeholder }) => {
  const { campaignId, isAdmin } = useOutletContext();
  const { data: allChars } = useGetNPCDataQuery(campaignId);
  const { data: allFactions } = useGetFactionsQuery(campaignId);
  const { data: allThings } = useGetThingQuery(campaignId);
  const { data: allLocations } = useGetLocationQuery(campaignId);
  const { data: allPartyMembers } = useGetPartyDataQuery(campaignId);

  const createLink = {};
  allChars?.forEach((char) => {
    createLink[char.name] = { type: "npc", id: `${char.character_id}` };
  });
  allFactions?.forEach((faction) => {
    createLink[faction.name] = { type: "faction", id: `${faction.lore_id}` };
  });
  allThings?.forEach((thing) => {
    createLink[thing.name] = { type: "thing", id: `${thing.lore_id}` };
  });
  allLocations?.forEach((location) => {
    createLink[location.name] = { type: "location", id: `${location.lore_id}` };
  });
  allPartyMembers?.forEach((partyMember) => {
    createLink[partyMember.name] = {
      type: "pc",
      id: `${partyMember.character_id}`,
    };
  });

  const textAreaRef = useRef(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Tracks the active suggestion index

  /**
   * Adjust textarea height to fit content
   * Preserves scroll position during height adjustment
   */
  const adjustHeight = () => {
    if (textAreaRef.current) {
      // Save current scroll position
      const scrollY = window.scrollY;
      textAreaRef.current.style.height = "auto"; // Reset height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set height to scrollHeight
      // Restore scroll position
      window.scrollTo(window.scrollX, scrollY);
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust height on initial render
  }, []);

  useEffect(() => {
    adjustHeight(); // Adjust height whenever value changes
  }, [value]);

  /**
   * Check if text is a valid URL
   */
  const isValidLink = (text) => {
    const linkRegex = /^(https?:\/\/|www\.)[^\s]+$/i;
    return linkRegex.test(text);
  };

  /**
   * Extract domain name from URL
   * Removes protocol and TLD to get the main domain name
   */
  const extractDomainName = (url) => {
    // Remove protocol (http, https, www) and .com/.org/.net etc.
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/\s]+)(?:\/.*)?$/i;
    const match = url.match(domainRegex);

    // get the index of the first dot in the domain name
    if (match && match[1]) {
      const domain = match[1];
      const firstDotIndex = domain.indexOf(".");
      return firstDotIndex !== -1 ? domain.substring(0, firstDotIndex) : domain;
    }

    // Return the original URL if no match is found
    return url;
  };

  /**
   * Handle text input change
   * Filters and displays suggestions based on @ mentions
   */
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const caretPosition = e.target.selectionStart;
    setCursorPosition(caretPosition);
    onChange(inputValue);

    // Check for '@' and filter suggestions
    const lastAtIndex = inputValue.lastIndexOf("@", caretPosition - 1);
    if (lastAtIndex !== -1) {
      const query = inputValue
        .slice(lastAtIndex + 1, caretPosition)
        .toLowerCase();
      const suggestionList = createLink ? Object.keys(createLink) : [];
      const filtered = suggestionList.filter((item) =>
        item.toLowerCase().includes(query),
      );

      // Check if the query is a valid link and add it to suggestions
      if (isValidLink(query)) {
        filtered.push(query);
      }

      setFilteredSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
      setActiveSuggestionIndex(-1); // Reset active suggestion index
    } else {
      setShowDropdown(false);
    }
  };

  /**
   * Handle keyboard navigation in suggestions dropdown
   * Supports arrow keys for navigation and Enter/Tab for selection
   */
  const handleKeyDown = (e) => {
    if (showDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1,
        );
      } else if (
        (e.key === "Enter" || e.key === "Tab") &&
        activeSuggestionIndex >= 0
      ) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      }
    }
  };

  /**
   * Handle suggestion click
   * Inserts selected suggestion as a formatted link
   */
  const handleSuggestionClick = (suggestion) => {
    const inputValue = value || ""; // Ensure value is not undefined
    const lastAtIndex = inputValue.lastIndexOf("@", cursorPosition - 1);
    const beforeAt = inputValue.slice(0, lastAtIndex);
    const afterAt = inputValue.slice(cursorPosition);

    let dynamicLink;
    if (isValidLink(suggestion)) {
      dynamicLink = { type: extractDomainName(suggestion), id: suggestion };
    } else {
      dynamicLink = createLink?.[suggestion] || {
        type: suggestion,
        id: suggestion,
      };
    }

    // Generate a link to the suggestion using the form [<suggestion> | link]
    const newValue = `${beforeAt}[${dynamicLink.type}|${dynamicLink.id}]${afterAt}`;
    onChange(newValue);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        inputRef={textAreaRef} // Attach ref to the TextField
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Handle key events
        placeholder={placeholder}
        fullWidth
        multiline
        style={{ resize: "none", overflowY: "hidden" }} // Disable manual resizing and hide vertical scrollbar
      />
      {showDropdown && (
        <List
          style={{
            position: "absolute",
            top: textAreaRef.current?.offsetHeight || 0,
            left: 0,
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                backgroundColor:
                  index === activeSuggestionIndex ? "#f0f0f0" : "white",
              }}
            >
              {suggestion}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default MultiLineTextField;
