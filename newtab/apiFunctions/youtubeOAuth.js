
var API_KEY = "AIzaSyDfOyxnl6HYzGkI9bIelIPdG6w-G8Qu8g8";
var CLIENT_ID = '940069828387-qi070615gvg7f7q8km07009eqaqv6jhu.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes, separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

// On load, called to load the auth2 library and API client library.
function handleYoutubeClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state listeners.
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        $("#container").off("click", "#" + "Youtube-signIn");
        $("#container").on("click", "#" + "Youtube-signIn", function(e) {
            gapi.auth2.getAuthInstance().signIn();
        });

        $("#container").off("click", "#" + "Youtube-signOut");
        $("#container").on("click", "#" + "Youtube-signOut", function(e) {
            gapi.auth2.getAuthInstance().signOut();
        });
    });
}

// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
    let widgetKey = "Youtube";
    let widgetConfig = getWidgetLocalStore(widgetKey);
    const card = document.getElementById(widgetKey + "Id");
    if(card === null)
        return;

    if(isSignedIn) {
        var youtubeSignInButtonEl = document.getElementById("Youtube-signIn");
        if(youtubeSignInButtonEl) {
            youtubeSignInButtonEl.id = "Youtube-signOut";
            youtubeSignInButtonEl.innerText = "Sign Out";
        }
        getUsersLikedVideos();
        widgetConfig["innerCard"]["isSignedInStatus"] = "1";
    }
    else{
        var youtubeSignOutButtonEl = document.getElementById("Youtube-signOut");
        if(youtubeSignOutButtonEl) {
            youtubeSignOutButtonEl.id = "Youtube-signIn";
            youtubeSignOutButtonEl.innerText = "Sign In";
        }
        deleteDiv(widgetKey + "-Liked" + "videos");
        widgetConfig["innerCard"]["isSignedInStatus"] = "0";
    }
    setWidgetLocalStore(widgetKey,widgetConfig);
}

function getUsersLikedVideos() {
    var request = gapi.client.request({
        'method': 'GET',
        'path': '/youtube/v3/channels',
        'params': {'part': 'contentDetails', 'mine': 'true'}
    });
    // Execute the API request.
    request.execute(function(response) {
        getLikedPlaylist(response.items[0].contentDetails.relatedPlaylists.likes);
    });
}

function getLikedPlaylist(playListID) {
    var request = gapi.client.request({
        'method': 'GET',
        'path': '/youtube/v3/playlistItems',
        'params': {'part': 'snippet', 'playlistId': playListID}
    });
    // Execute the API request.
    request.execute(function(response) {
        var likedVideos = response.items;
        var listCardItemObj = new Array();
        for(var i in likedVideos) {
            var videoInfo = likedVideos[i].snippet;
            //var data = videoInfo.title + videoInfo.thumbnails.medium.url + videoInfo.resourceId.videoId;
            cardItem = new CardItemObj(videoInfo.thumbnails.medium.url,videoInfo.title, "https://www.youtube.com/watch?v=" + videoInfo.resourceId.videoId,"");
            listCardItemObj.push(cardItem);
        }
        const widgetKey = "Youtube";
        const card = document.getElementById(widgetKey + "Id");
        const innerWidgetKey = widgetKey + "-Liked" + "videos";
        const topicName = "Liked Videos";
        renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,3);
    });
}

// $( document ).ready(function() {
//     handleYoutubeClientLoad();
// });

$(window).on('load', function() {
    handleYoutubeClientLoad();
});