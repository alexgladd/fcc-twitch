/*
 * Twitch app Javascript
 *
 * https://dev.twitch.tv/docs/
 */


// globals ------------------------------------------------

const twitchBaseUri = "https://api.twitch.tv/kraken";
const twitchUsersUri = twitchBaseUri + "/users";
const twitchStreamsUri = twitchBaseUri + "/streams";

// jQuery start -------------------------------------------

$(document).ready(function() {
  // setup filter buttons
  $("#filter-all").on("click", onFilterAll);
  $("#filter-online").on("click", onFilterOnline);
  $("#filter-offline").on("click", onFilterOffline);
});

// events -------------------------------------------------

function onFilterAll() {
  $("#filter-all").addClass("tf-active");
  $("#filter-online").removeClass("tf-active");
  $("#filter-offline").removeClass("tf-active");
}

function onFilterOnline() {
  $("#filter-all").removeClass("tf-active");
  $("#filter-online").addClass("tf-active");
  $("#filter-offline").removeClass("tf-active");
}

function onFilterOffline() {
  $("#filter-all").removeClass("tf-active");
  $("#filter-online").removeClass("tf-active");
  $("#filter-offline").addClass("tf-active");
}
