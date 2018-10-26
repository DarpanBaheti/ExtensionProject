
function handleTwitterOAuth(widgetKey) {
    $("#container").off("click", "#" + "Twitter-signIn");
    $("#container").on("click", "#" + "Twitter-signIn", function(e) {
        // checkSuccessfulOauth(e);
        oAuthTwitter(e);
    });

    $("#container").off("click", "#" + "Twitter-signOut");
    $("#container").on("click", "#" + "Twitter-signOut", function(e) {
        onSignOut();
        var twitterSignOutButtonEl = document.getElementById(e.target.id);
        twitterSignOutButtonEl.id = "Twitter-signIn";
        twitterSignOutButtonEl.innerText = "Sign In";
    });
}

function oAuthTwitter(e) {
    var uniqueUserId = localStorage.getItem("uniqueUserId");
    twitterSignInUrl = 'http://localhost:8081/signInWithTwitter' + "?userId=" + uniqueUserId;
    twitterOAuthWindow = window.open(twitterSignInUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    twitterOAuthWindow.focus();

    var OauthInterval = setInterval(function() {
        if(twitterOAuthWindow.closed) {
            let widgetKey = "Twitter";
            const localStorageRes = localStorage.getItem(widgetKey);
            const widgetConfig = JSON.parse(localStorageRes);
            if(widgetConfig["innerCard"]["isSignedInStatus"] === "1") {
                twitterSignInButtonEl.id = "Twitter-signOut";
                twitterSignInButtonEl.innerText = "Sign Out";

                let card = document.getElementById(widgetKey + "Id");
                new twitterWidget("params").loadUserHomeTimeLine(card,widgetKey);
            }
            clearInterval(OauthInterval);
        }
    }, 1000);
}

// function checkSuccessfulOauth(e) {
//     var twitterSignInButtonEl = document.getElementById(e.target.id);
//
//     /* Cross Origin Listener */
//     // window.addEventListener('message', function(e) {
//     //     var message = e.data;
//     //     if(e.origin === "http://localhost:8000")
//     //         console.log(message + " " + e.origin);
//     // });
//
//     /* Local Storage Listner */
//     $(window).unbind('storage');
//     $(window).bind('storage', function (e) {
//         widgetKey = "Twitter";
//         const localStorageRes = localStorage.getItem(widgetKey);
//         const widgetConfig = JSON.parse(localStorageRes);
//
//         if(widgetConfig["innerCard"]["isSignedInStatus"] === "1") {
//             twitterSignInButtonEl.id = "Twitter-signOut";
//             twitterSignInButtonEl.innerText = "Sign Out";
//             $(window).unbind('storage');
//
//             let widgetKey = "Twitter";
//             let card = document.getElementById(widgetKey + "Id");
//             new twitterWidget("params").loadUserHomeTimeLine(card,widgetKey);
//         }
//     });
// }

function onSignOut() {
    widgetKey = "Twitter";
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    widgetConfig["innerCard"]["isSignedInStatus"] = "0";
    const widgetConfigJson = JSON.stringify(widgetConfig);
    localStorage.setItem(widgetKey, widgetConfigJson);

    // $.get('http://localhost:8081/signOutFromTwitter', function(data) {
    //     console.log("Response " + data);
    // });

    const innerWidgetKey = widgetKey + "-" + "MyFeeds" + "Id";
    deleteDiv(innerWidgetKey);
}

// function checkOauthTwitterStatus() {
//     var uniqueUserId = localStorage.getItem("uniqueUserId");
//     twitterSignInStatusUrl = 'http://localhost:8081/checkTwitterSignInStatus' + "?userId=" + uniqueUserId;
//     $.get(twitterSignInStatusUrl, function(responseJson) {
//         console.log(responseJson);
//     });
// }