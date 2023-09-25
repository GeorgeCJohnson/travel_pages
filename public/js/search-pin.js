$(document).ready(function () {
    // On any input into the search bar, filter the pins based on the search text
    $("#search-input").on("input", function () {
      const searchText = $(this).val().toLowerCase();
      const noResultsContainer = $(".no-results-container");
      let hasMatchingResults = false; 
  
      // Loop through each pin and check if the search text is in the title, text, or timestamp
      $(".pin").each(function () {
        const pin = $(this);
        const cardTitle = pin.find(".card-title").text().toLowerCase();
        const cardText =
          pin.find(".card-text").text().toLowerCase() ||
          pin.find("textarea").val().toLowerCase();
        const timestamp = pin.find(".timestamp").text().toLowerCase();
  
        if (
          cardTitle.includes(searchText) ||
          cardText.includes(searchText) ||
          timestamp.includes(searchText)
        ) {
          pin.css("display", "block");
          pin.removeClass("no-results");
          hasMatchingResults = true;
        } else {
          pin.css("display", "none");
          pin.addClass("no-results");
        }
      });
  
      // If no matching results are found, show the no results container
      if (hasMatchingResults) {
        noResultsContainer.addClass("no-results-container-noshow");
      } else {
        noResultsContainer.removeClass("no-results-container-noshow");
      }
    });
  });