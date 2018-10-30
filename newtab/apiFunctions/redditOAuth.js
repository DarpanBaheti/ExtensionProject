
var REDDIT_CLIENT_ID = "iYzb1bqskWDaDg";
var REDDIT_STATE = "qwertyuiop"; // Random String

function handleRedditOAuth(widgetKey) {
    $("#container").off("click", "#" + "Reddit-signIn");
    $("#container").on("click", "#" + "Reddit-signIn", function(e) {
        oAuthReddit(e);
    });

    $("#container").off("click", "#" + "Reddit-signOut");
    $("#container").on("click", "#" + "Reddit-signOut", function(e) {
        redditOnSignOut();
        var redditSignOutButtonEl = document.getElementById(e.target.id);
        redditSignOutButtonEl.id = "Reddit-signIn";
        redditSignOutButtonEl.innerText = "Sign In";
    });
}

function oAuthReddit(e) {
    var redditRedirectUri = BASE_URL + "/newtab/authorizedReddit.html";

    var redditSignInUrl = "https://www.reddit.com/api/v1/authorize?";
    redditSignInUrl += "client_id=" + REDDIT_CLIENT_ID;
    redditSignInUrl += "&response_type=code&state=" + REDDIT_STATE;
    redditSignInUrl += "&redirect_uri=" + redditRedirectUri;
    redditSignInUrl += "&duration=permanent";
    redditSignInUrl += "&scope=identity,mysubreddits,read";

    var redditOAuthWindow = window.open(redditSignInUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    redditOAuthWindow.focus();

    var redditSignInButtonEl = document.getElementById(e.target.id);
    var redditOauthInterval = setInterval(function() {
        if(redditOAuthWindow.closed) {
            let widgetKey = "Reddit";
            const localStorageRes = localStorage.getItem(widgetKey);
            const widgetConfig = JSON.parse(localStorageRes);
            if(widgetConfig["innerCard"]["isSignedInStatus"] === "1") {
                redditSignInButtonEl.id = "Reddit-signOut";
                redditSignInButtonEl.innerText = "Sign Out";

                let card = document.getElementById(widgetKey + "Id");
                new redditWidget("params").loadUserHomeTimeLine(card,widgetKey);
            }
            clearInterval(redditOauthInterval);
        }
    }, 1000);
}

function redditOnSignOut() {
    let widgetKey = "Reddit";
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    widgetConfig["innerCard"]["isSignedInStatus"] = "0";
    const widgetConfigJson = JSON.stringify(widgetConfig);
    localStorage.setItem(widgetKey, widgetConfigJson);

    const innerWidgetKey = widgetKey + "-" + "HomeFeeds" + "Id";
    deleteDiv(innerWidgetKey);
}