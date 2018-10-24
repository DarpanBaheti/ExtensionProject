
function getTwitterSettingsContent(widgetKey) {
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    const parameters = widgetConfig['innerCard'];
    const listOfFollowedUsers = parameters['followedUsers'];

    if (parameters.isSignedInStatus == "0") {
        var twitter_signInButton = "<div class='settings-items'>Twitter Feeds<button class='signInButtons' id='Twitter-signIn'>Sign In</button></div>";
    }
    else {
        var twitter_signInButton = "<div class='settings-items'>Twitter Feeds<button class='signInButtons' id='Twitter-signOut'>Sign Out</button></div>";
    }

    if (parameters.trendingTwitterTopics == "0") {
        var trending_twitterTopics = "<div class='settings-items'>Trending Topics<label class='switch'><input type='checkbox' id='Twitter-trendingTopics-checkbox'> <span class='slider round'></span></label></div>";
    }
    else {
        var trending_twitterTopics = "<div class='settings-items'>Trending Topics<label class='switch'><input type='checkbox' id='Twitter-trendingTopics-checkbox' checked> <span class='slider round'></span></label></div>";
    }

    const twitter_follow = "<div class='settings-items'>Followed Users" + getSelectForm(widgetKey, widgetKey + "-followedUsers", listOfFollowedUsers) + "</div>";

    attachTwitterListeners(widgetKey,parameters);
    return twitter_signInButton + trending_twitterTopics + twitter_follow;
}

function attachTwitterListeners(widgetKey,parameters) {
    const listOfFollowedUsers = parameters['followedUsers'];

    handleTwitterOAuth(widgetKey);

    $("#container").off("change", "#" + "Twitter-trendingTopics-checkbox");
    $("#container").on("change", "#" + "Twitter-trendingTopics-checkbox", function(e) {
        let card = document.getElementById(widgetKey + "Id");
        let widgetConfig = getWidgetLocalStore(widgetKey);
        if (e.target.checked) {
            new twitterWidget("params").loadTrendingTwitterTopics(card,widgetKey);
            widgetConfig["innerCard"]["trendingTwitterTopics"] = "1";
        }
        else {
            deleteAllDiv(widgetKey + "-trendingTwitterTopicId");
            widgetConfig["innerCard"]["trendingTwitterTopics"] = "0";
        }
        setWidgetLocalStore(widgetKey,widgetConfig);
    });

    $("#container").off("click", "#" + widgetKey + "-followedUsers" + "-selectBox");
    $("#container").on("click", "#" + widgetKey + "-followedUsers" + "-selectBox", function(e) {
        e.preventDefault();
        showCheckboxes(widgetKey + "-followedUsers" + "-checkboxes");
    });

    for(var el in listOfFollowedUsers) {
        const elName = el;
        const elId = widgetKey + "-" + elName + "Id";
        const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
        const elTopicName = "@" + elName;


        $("#container").off("change", "#" + elCheckboxId);
        $("#container").on("change", "#" + elCheckboxId, function(e) {
            let card = document.getElementById(widgetKey + "Id");
            let widgetConfig = getWidgetLocalStore(widgetKey);
            if (e.target.checked) {
                new twitterWidget("params").loadUserTwitterTimeLine(card,widgetKey,elId,elName,elTopicName);
                widgetConfig["innerCard"]["followedUsers"][elName] = "1";
            }
            else {
                deleteDiv(elId);
                widgetConfig["innerCard"]["followedUsers"][elName] = "0";
            }
            setWidgetLocalStore(widgetKey,widgetConfig);
        });
    }
}