import React, { useState } from "react";
import MultiLineTextField from "./MultiLineTextField";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const MultiLineTextFieldExample = () => {
  const [textValue, setTextValue] = useState(
    "This is a sample text with some words to highlight. You can search for 'sample', 'text', or any other word.",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState("highlighted-text");

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        MultiLineTextField with Text Highlighting
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Text to Highlight"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter text to highlight in the field below"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
          }
          label="Case Sensitive"
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" gutterBottom>
            Highlight Style:
          </Typography>
          {[
            "highlighted-text",
            "highlight-search-result",
            "highlight-error",
            "highlight-success",
            "highlight-info",
          ].map((style) => (
            <FormControlLabel
              key={style}
              control={
                <input
                  type="radio"
                  value={style}
                  checked={highlightStyle === style}
                  onChange={(e) => setHighlightStyle(e.target.value)}
                />
              }
              label={style.replace("highlight-", "").replace("-", " ")}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Text Field with Highlighting:
        </Typography>
        <MultiLineTextField
          value={textValue}
          onChange={setTextValue}
          placeholder="Type your text here..."
          highlightText={searchTerm}
          highlightClassName={highlightStyle}
          caseSensitive={caseSensitive}
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        Try typing @ followed by a character name to see the autocomplete
        feature in action!
      </Typography>
    </Box>
  );
};

export default MultiLineTextFieldExample;
