import React, { useEffect } from "react";

const GoogleSearch = ({ command, speakText }) => {
  useEffect(() => {
    // Convert command to lowercase to ensure case insensitivity
    const lowerCaseCommand = command.toLowerCase().trim();

    // Log the received command for debugging
    console.log("Received command:", lowerCaseCommand);

    // Check if the command contains "search for"
    if (lowerCaseCommand.includes("search for")) {
      // Extract the search query
      const searchQuery = lowerCaseCommand.split("search for")[1].trim();

      // Log the extracted search query
      console.log("Extracted search query:", searchQuery);

      if (searchQuery) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(
          searchQuery
        )}`;
        console.log("Google Search URL:", url); // Log the URL for debugging

        // Open the search query in a new tab
        const newTab = window.open(url, "_blank");

        // Check if the new tab was successfully opened
        if (newTab) {
          newTab.focus(); // Bring the new tab to focus
          speakText(`Opening ${searchQuery} on Google, sir...`);
        } else {
          speakText("Please allow pop-ups for this functionality to work.");
          console.log("Pop-up blocked!"); // Log if pop-up was blocked
        }
      } else {
        speakText(
          "I couldn't find anything to search. Please provide a valid search query."
        );
      }
    }
  }, [command, speakText]);

  return null; // No rendering needed for this component
};

export default GoogleSearch;
