
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
        apiKey: 'AIzaSyDfOyxnl6HYzGkI9bIelIPdG6w-G8Qu8g8',
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        const widgetKey = "Youtube";
        $("#container").off("change", "#" + "Youtube-trending-checkbox");
        $("#container").on("change", "#" + "Youtube-trending-checkbox", function(e) {
            let card = document.getElementById(widgetKey + "Id");
            let widgetConfig = getWidgetLocalStore(widgetKey);
            if (e.target.checked) {
                gapi.auth2.getAuthInstance().signIn();
                widgetConfig["innerCard"]["likedVideosStatus"] = "1";
            }
            else {
                deleteDiv(widgetKey + "-Liked" + "videos");
                gapi.auth2.getAuthInstance().signOut();
                widgetConfig["innerCard"]["likedVideosStatus"] = "0";
            }
            setWidgetLocalStore(widgetKey,widgetConfig);
        });
    });
}

// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        getUsersLikedVideos();
    } else {
        //
    }
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
        if(card)
            renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,3);
    });
}


document.onreadystatechange = functionLoad;
function functionLoad () {
    if (document.readyState === "complete") {
        handleYoutubeClientLoad();
    }
}