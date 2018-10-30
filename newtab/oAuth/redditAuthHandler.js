var BASE_URL = "http://localhost:8000";

/* Reddit OAuth */
let params = (new URL(document.location)).searchParams;
if(params.has("code")) {
    var code = params.get("code");

    var client_id = "iYzb1bqskWDaDg";
    var client_secret = "PodkAe4ExHY_7cb1S45nH726ln4";
    var uri = BASE_URL + "/newtab/authorizedReddit.html";
    var base = "https://www.reddit.com/api/v1/access_token";

    $.ajax({
        type: "POST",
        crossDomain: true,
        url: base,
        data: {
            "redirect_uri": uri,
            "grant_type": "authorization_code",
            "code": code
        },
        headers: {
            "Authorization": "Basic " + btoa(`${client_id}:${client_secret}`)
        }
    }).done(function (resp) {
        widgetKey = "Reddit";
        const localStorageRes = localStorage.getItem(widgetKey);
        const widgetConfig = JSON.parse(localStorageRes);
        widgetConfig["innerCard"]["isSignedInStatus"] = "1";
        widgetConfig["innerCard"]["refresh_token"] = resp.refresh_token;
        const widgetConfigJson = JSON.stringify(widgetConfig);
        localStorage.setItem(widgetKey, widgetConfigJson);
        window.close();
    }).fail(function (resp) {
        window.close();
    });
}

// /* API wrapper*/
// redditOauth = function () {
//     var authenticationUrl = snoowrap.getAuthUrl({
//         clientId: 'iYzb1bqskWDaDg',
//         scope: ['identity', 'wikiread', 'mysubreddits', 'read'],
//         redirectUri: 'http://localhost:8000/newtab/index.html',
//         permanent: true,
//         state: 'qwertyuiop' // a random string, this could be validated when the user is redirected back
//     });
//     // var redditOAuthWindow = window.open(authenticationUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
//     window.location = authenticationUrl; // send the user to the authentication url
// };
//
// var redditRef = null;
// getData = function() {
//     // Get the `code` querystring param (assuming the user was redirected from reddit)
//     var params = new URL(window.location.href).searchParams;
//     if(params.has("code")) {
//         var code = params.get('code');
//         snoowrap.fromAuthCode({
//             code: code,
//             userAgent: 'Extension',
//             clientId: 'iYzb1bqskWDaDg',
//             clientSecret: "PodkAe4ExHY_7cb1S45nH726ln4",
//             redirectUri: 'http://localhost:8000/newtab/index.html'
//         }).then(r => {
//             redditRef = r;
//
//             r.getHot().then(console.log)
//
//             // r.getMe().then(console.log);
//             // Now we have a requester that can access reddit through the user's account
//             // return r.getHot().then(posts => {
//             //     // do something with posts from the front page
//             // });
//         })
//     }
// };