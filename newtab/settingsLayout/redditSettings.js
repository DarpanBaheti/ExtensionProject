
function getRedditSettingsContent(widgetKey) {
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    const parameters = widgetConfig['innerCard'];
    const listOfElements = parameters['subRedditLists'];

    if (parameters.trendingPost == "0") {
        var trending_posts = "<div class='settings-items'>Trending Posts<label class='switch'><input type='checkbox' id='Reddit-trending-checkbox'><span class='slider round'></span></label></div>";
    }
    else {
        var trending_posts = "<div class='settings-items'>Trending Posts<label class='switch'><input type='checkbox' id='Reddit-trending-checkbox' checked><span class='slider round'></span></label></div>";
    }

    if (parameters.trendingSubReddits == "0") {
        var trending_subreddits = "<div class='settings-items'>Trending Subreddits<label class='switch'><input type='checkbox' id='Reddit-subtrending-checkbox'> <span class='slider round'></span></label></div>";
    }
    else {
        var trending_subreddits = "<div class='settings-items'>Trending Subreddits<label class='switch'><input type='checkbox' id='Reddit-subtrending-checkbox' checked> <span class='slider round'></span></label></div>";
    }

    const subreddits_follow = "<div class='settings-items'>Subreddits Picks" + getSelectForm(widgetKey, widgetKey + "-follow", listOfElements) + "</div>";

    attachRedditListeners(widgetKey,parameters);
    return trending_posts + trending_subreddits + subreddits_follow;
}

function attachRedditListeners(widgetKey,parameters) {
    const listOfElements = parameters['subRedditLists'];

    $("#container").off("change", "#" + "Reddit-trending-checkbox");
    $("#container").on("change", "#" + "Reddit-trending-checkbox", function(e) {
        let card = document.getElementById(widgetKey + "Id");
        let widgetConfig = getWidgetLocalStore(widgetKey);
        if (e.target.checked) {
            new redditWidget("params").loadTrendingPost(card,widgetKey);
            widgetConfig["innerCard"]["trendingPost"] = "1";
        }
        else {
            deleteDiv(widgetKey + "-TrendingPostId");
            widgetConfig["innerCard"]["trendingPost"] = "0";
        }
        setWidgetLocalStore(widgetKey,widgetConfig);
    });

    $("#container").off("change", "#" + "Reddit-subtrending-checkbox");
    $("#container").on("change", "#" + "Reddit-subtrending-checkbox", function(e) {
        let card = document.getElementById(widgetKey + "Id");
        let widgetConfig = getWidgetLocalStore(widgetKey);
        if (e.target.checked) {
            new redditWidget("params").loadTrendingSubReddits(card,widgetKey);
            widgetConfig["innerCard"]["trendingSubReddits"] = "1";
        }
        else {
            deleteAllDiv(widgetKey + "-trendingSubRedditsId");
            widgetConfig["innerCard"]["trendingSubReddits"] = "0";
        }
        setWidgetLocalStore(widgetKey,widgetConfig);
    });

    $("#container").off("click", "#" + widgetKey + "-follow" + "-selectBox");
    $("#container").on("click", "#" + widgetKey + "-follow" + "-selectBox", function(e) {
        e.preventDefault();
        showCheckboxes(widgetKey + "-follow" + "-checkboxes");
    });

    for(var el in listOfElements) {
        const elName = el;
        const elId = widgetKey + "-" + elName + "Id";
        const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
        const elTopicName = "/r/" + elName;

        $("#container").off("change", "#" + elCheckboxId);
        $("#container").on("change", "#" + elCheckboxId, function(e) {
            let card = document.getElementById(widgetKey + "Id");
            let widgetConfig = getWidgetLocalStore(widgetKey);
            if (e.target.checked) {
                new redditWidget("params").loadSubRedditsPost(card,widgetKey,elName,elId,elTopicName);
                widgetConfig["innerCard"]["subRedditLists"][elName] = "1";
            }
            else {
                deleteDiv(elId);
                widgetConfig["innerCard"]["subRedditLists"][elName] = "0";
            }
            setWidgetLocalStore(widgetKey,widgetConfig);
        });
    }
}