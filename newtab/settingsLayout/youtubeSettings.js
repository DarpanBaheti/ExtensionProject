// ---------------------------------------------------------------
// --------------------------------------------------------------- Youtube Widgets Setting Layout

function getYoutubeSettingsContent(widgetKey) {
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    const parameters = widgetConfig['innerCard'];

    const listOfCat = parameters['trendingCatLists'];
    const listOfChannel = parameters['channelsList'];
    const listOfElements = {};
    for(var elName in listOfCat) {
        listOfElements[elName] = listOfCat[elName].status;
    }

    if (parameters.likedVideosStatus == "0") {
        var liked_videos = "<div class='settings-items'>Liked Videos<label class='switch'><input type='checkbox' id='Youtube-trending-checkbox'><span class='slider round'></span></label></div>";
    }
    else {
        var liked_videos = "<div class='settings-items'>Liked Videos<label class='switch'><input type='checkbox' id='Youtube-trending-checkbox' checked><span class='slider round'></span></label></div>";
    }

    var youtube_trending = "<div class='settings-items'>Trending Categories" + getSelectForm(widgetKey, widgetKey + "-trendingCat", listOfElements) + "</div>";
    var youtube_channels = "<div class='settings-items'>Channels List" + getSelectForm(widgetKey, widgetKey + "-channelsList", listOfChannel) + "</div>";

    attachYoutubeListeners(widgetKey,parameters);
    return liked_videos + youtube_trending + youtube_channels;
}

function attachYoutubeListeners(widgetKey,parameters) {
    const listOfCat = parameters['trendingCatLists'];
    const listOfChannel = parameters['channelsList'];

    // $("#container").off("change", "#" + "Youtube-trending-checkbox");
    // $("#container").on("change", "#" + "Youtube-trending-checkbox", function(e) {
    //     let card = document.getElementById(widgetKey + "Id");
    //     let widgetConfig = getWidgetLocalStore(widgetKey);
    //     let parameters = widgetConfig['innerCard'];
    //     let youtubeWidgetVar = new youtubeWidget(parameters);
    //     if (e.target.checked) {
    //         youtubeWidgetVar.loadLikedVideos(card,widgetKey);
    //         widgetConfig["innerCard"]["likedVideosStatus"] = "1";
    //     }
    //     else {
    //         deleteDiv(widgetKey + "-Liked" + "videos");
    //         widgetConfig["innerCard"]["likedVideosStatus"] = "0";
    //     }
    //     setWidgetLocalStore(widgetKey,widgetConfig);
    // });


    $("#container").off("click", "#" + widgetKey + "-trendingCat" + "-selectBox");
    $("#container").on("click", "#" + widgetKey + "-trendingCat" + "-selectBox", function(e) {
        e.preventDefault();
        showCheckboxes(widgetKey + "-trendingCat" + "-checkboxes");
    });

    for(var el in listOfCat) {
        const elName = el;
        const elId = widgetKey + "-" + elName + "Id";
        const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
        const elTopicName = "Trending " + elName;

        $("#container").off("change", "#" + elCheckboxId);
        $("#container").on("change", "#" + elCheckboxId, function(e) {
            let card = document.getElementById(widgetKey + "Id");
            let widgetConfig = getWidgetLocalStore(widgetKey);
            let parameters = widgetConfig["innerCard"];
            if (e.target.checked) {
                new youtubeWidget(parameters).loadTrendingCat(card,widgetKey,elId,elName,elTopicName);
                widgetConfig["innerCard"]["trendingCatLists"][elName].status = "1";
            }
            else {
                deleteDiv(elId);
                widgetConfig["innerCard"]["trendingCatLists"][elName].status = "0";
            }
            setWidgetLocalStore(widgetKey,widgetConfig);
        });
    }

    $("#container").off("click", "#" + widgetKey + "-channelsList" + "-selectBox");
    $("#container").on("click", "#" + widgetKey + "-channelsList" + "-selectBox", function(e) {
        e.preventDefault();
        showCheckboxes(widgetKey + "-channelsList" + "-checkboxes");
    });

    for(var el in listOfChannel) {
        const elName = el;
        const elId = widgetKey + "-" + elName + "Id";
        const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
        const elTopicName = "Channel: " + elName;


        $("#container").off("change", "#" + elCheckboxId);
        $("#container").on("change", "#" + elCheckboxId, function(e) {
            let card = document.getElementById(widgetKey + "Id");
            let widgetConfig = getWidgetLocalStore(widgetKey);
            if (e.target.checked) {
                new youtubeWidget("params").loadChannel(card,widgetKey,elId,elName,elTopicName);
                widgetConfig["innerCard"]["channelsList"][elName] = "1";
            }
            else {
                deleteDiv(elId);
                widgetConfig["innerCard"]["channelsList"][elName] = "0";
            }
            setWidgetLocalStore(widgetKey,widgetConfig);
        });
    }
}