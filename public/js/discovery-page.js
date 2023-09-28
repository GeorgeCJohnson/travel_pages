$(document).ready(function () {
    const pinnedIcon = "bi-pin-angle-fill";
    const unpinnedIcon = "bi-pin";
  
    // On load, get the user's pinned cards by looking up the session id
    $.ajax({
      url: "/api/user/session/lookup",
      method: "GET",
    }).then(function (response) {
      // if not logged in, do nothing
      if (response.logged_in === false) {
        return;
      }
      // if logged in but no pinned cards, do nothing
      else if (response.saved_pins === null || response.saved_pins === "") {
        return;
      }
      else {
        var pinnedCards = JSON.parse(response.saved_pins);
        checkPinnedCards(pinnedCards);
      }
    });
  
    // Refresh the page when the refresh button is clicked
    $(".btn-refresh").click(function () {
      location.reload();
    });
  
    // Create a click event listener on the pin icons of every card
    // When the pin icon is clicked, toggle the icon between the filled pin and the empty pin and save the card to the user's pinned cards
    $(".card-icon-pin").click(function (e) {
      e.preventDefault();
      var pinIconEl = $(this);
  
      $.ajax({
        url: "/api/user/session/lookup",
        method: "GET",
      }).then(function (response) {
        // if not logged in, do nothing except show a red popover that says "You must be logged in to pin a card"
        if (response.logged_in === false) {
          pinIconEl.popover("show");
          return;
        } else {
          // Toggle the pin icon between the filled pin and the empty pin
          if (pinIconEl.hasClass(pinnedIcon)) {
            pinIconEl.removeClass(pinnedIcon);
            pinIconEl.addClass(unpinnedIcon);
          } else {
            pinIconEl.addClass(pinnedIcon);
            pinIconEl.removeClass(unpinnedIcon);
          }
  
          // Get the id of the card that was clicked by looking for data-pinid in the parent element that has the class of pin
          var cardId = pinIconEl.closest(".pin").attr("data-pinid");
  
          // Add the card to the user's pinned cards
          $.ajax({
            url: "/api/user/savepin",
            method: "PUT",
            data: {
              pinId: cardId,
            },
          });
        }
      });
    });
  
    // function to check each key in the pinnedCards array against the cardId
    function checkPinnedCards(pinnedCards) {
      $(".card-icon-pin").each(function () {
        var cardId = $(this).closest(".pin").attr("data-pinid");
        // if the pinnedCards JSON array includes the cardId, add the class of pinned to the card
        if (pinnedCards.some((e) => e.pinId === cardId)) {
          $(this).addClass(pinnedIcon);
          $(this).removeClass(unpinnedIcon);
        }
      });
    }
  });