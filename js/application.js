/*
 * Twitch app Javascript
 *
 * https://dev.twitch.tv/docs/
 */


// globals ------------------------------------------------

const twitchChannelBaseUrl = "https://twitch.tv/";
const twitchBaseUri = "https://api.twitch.tv/kraken";
const twitchUsersUri = twitchBaseUri + "/users";
const twitchStreamsUri = twitchBaseUri + "/streams";
const twitchUsers = [
  "freecodecamp",
  "monstercat",
  "a_couple_streams",
  "quill18",
  "lirik",
  "badnewsbaron",
  "sovietwomble"
];

const clientId = "ghaicz7nmjklnhk1ejdj1qosow8gl1";

const requestSettings = {
  dataType: "json",
  accepts: {
    json: "application/vnd.twitchtv.v5+json"
  },
  headers: {
    "Client-ID": clientId
  }
};

var streamers = {};

// jQuery start -------------------------------------------

$(document).ready(function() {
  // setup filter buttons
  $("#filter-all").on("click", onFilterAll);
  $("#filter-online").on("click", onFilterOnline);
  $("#filter-offline").on("click", onFilterOffline);

  // start API fetch
  getTwitchUsers();
});

// events -------------------------------------------------

function onUsers(usersResponse) {
  //console.log(usersResponse);

  if (usersResponse && usersResponse.users) {
    for (var i = 0; i < usersResponse.users.length; i++) {
      var tuser = usersResponse.users[i];

      var userObj = {
        id: tuser._id,
        username: tuser.name,
        display_name: tuser.display_name,
        logo: tuser.logo
      };

      // add to streamers list
      streamers[tuser._id] = userObj;
      // update user status
      updateUserStatus(userObj);
      // request stream details
      getTwitchStream(userObj.id);
    }
  }

  //console.log(streamers);
}

function onStream(streamResponse) {
  if (streamResponse) {
    var user = streamers[this.id];

    if (streamResponse.stream) {
      var tstream = streamResponse.stream;

      user.online = true;
      user.streaming = tstream.channel.game;
    } else {
      user.online = false;
    }

    updateUserStream(user);
  }
}

function onFilterAll() {
  $("#filter-all").addClass("tf-active");
  $("#filter-online").removeClass("tf-active");
  $("#filter-offline").removeClass("tf-active");

  showAll();
}

function onFilterOnline() {
  $("#filter-all").removeClass("tf-active");
  $("#filter-online").addClass("tf-active");
  $("#filter-offline").removeClass("tf-active");

  filterStreams(true);
}

function onFilterOffline() {
  $("#filter-all").removeClass("tf-active");
  $("#filter-online").removeClass("tf-active");
  $("#filter-offline").addClass("tf-active");

  filterStreams(false);
}

// functions ----------------------------------------------

function getTwitchUsers() {
  var uri = twitchUsersUri + "?login=" + twitchUsers.join(",");

  $.ajax(uri, requestSettings).done(onUsers);
}

function getTwitchStream(userid) {
  var uri = twitchStreamsUri + "/" + userid;

  var reqSettings = $.extend({}, requestSettings, { context: { id: userid } });

  $.ajax(uri, reqSettings).done(onStream);
}

function updateUserStatus(user) {
  var blockId = "#s-" + user.username;
  var logoId = "#s-" + user.username + "-logo";
  var streamId = "#s-" + user.username + "-stream";
  var linkId = "#s-" + user.username + "-link";

  $(logoId).attr("src", user.logo);
  $(linkId).attr("href", twitchChannelBaseUrl + user.username);
  $(streamId).html("Loading...");
  $(blockId).data("id", user.id);
}

function updateUserStream(user) {
  var streamId = "#s-" + user.username + "-stream";
  var statusId = "#s-" + user.username + "-status";

  if (user.online) {
    $(statusId).addClass("stream-online").removeClass("stream-unk");
    $(streamId).html("Streaming: <em>" + user.streaming + "</em>");
  } else {
    $(statusId).addClass("stream-offline").removeClass("stream-unk");
    $(streamId).html("Offline");
  }
}

function filterStreams(online) {
  $("div.stream").each(function(idx) {
    if ($(this).data("id")) {
      var user = streamers[ $(this).data("id") ];

      if (online == user.online) {
        $(this).prop("hidden", false);
      } else {
        $(this).prop("hidden", true);
      }
    } else {
      $(this).prop("hidden", true);
    }
  });
}

function showAll() {
  $("div.stream").each(function(idx) {
    $(this).prop("hidden", false);
  });
}
