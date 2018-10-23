
document.addEventListener("updateLocalStorage", function (event) {
    var diffOfList = event.detail.data;
    console.log("Recieved updateLocalStorage request from Content for " + diffOfList);
    updateLocalStorage(diffOfList);
    console.log("LocalStorage updated");
    sendReloadNewTabs();
});

function updateLocalStorage(diffOfList) {
    var widgetStatusList = getWidgetLocalStore("widgetStatusList");
    if(widgetStatusList == null || widgetStatusList == undefined)
        widgetStatusList = {};
    for(var i in diffOfList) {
        var widgetKey = diffOfList[i];
        widgetStatusList[widgetKey] = "0";
        var widgetConfigJson = getWidgetConfigJson(widgetKey);
        localStorage.setItem(widgetKey, widgetConfigJson);
    }
    localStorage.setItem("widgetStatusList", JSON.stringify(widgetStatusList));
}

function sendReloadNewTabs() {
    console.log("Reload New Tab request to content from script.js");
    var selectionFired = new CustomEvent('reloadNewTabs', {'detail': {"message": "Reload New Tabs"}});
    document.dispatchEvent(selectionFired);
}

function getWidgetConfigJson(widgetKey) {
    if(widgetKey == "Reddit"){
        return getRedditConfigJson(widgetKey);
    }
    else if(widgetKey == "Youtube") {
        return getYoutubeConfigJson(widgetKey);
    }
    else if(widgetKey == "Twitter") {
        return getTwitterConfigJson(widgetKey);
    }
}

function getRedditConfigJson(widgetKey) {
    var redditConfigLocal = {
        rankCard: "1",
        innerCard : {
            trendingPost: "0",
            trendingSubReddits: "0",
            subRedditLists: {
                nosleep:"0",
                tifu:"0"
            }
        }
    };
    return JSON.stringify(redditConfigLocal);
}

function getYoutubeConfigJson(widgetKey) {
    var youtubeConfigLocal = {
        rankCard: "2",
        innerCard: {
            trendingCatLists: {
                Videos: {
                    status: "1",
                    loc: "world"
                },
                Music: {
                    status: "0",
                    loc: "self"
                },
                Sports: {
                    status: "0",
                    loc: "world"
                }
            },
            channelsList: {
                movieclipsTRAILERS: "0"
            },
            likedVideos: {
                nu9nVkroSvU: "1",
                ExgUVFlGsAM: "1"
            },
            likedVideosStatus: "0"
        }
    };
    return JSON.stringify(youtubeConfigLocal);
}

function getTwitterConfigJson(widgetKey) {
    var twitterConfigLocal = {
        rankCard: "3",
        innerCard: {
            trendingTwitterTopics: "0",
            followedUsers: {
                imVkohli: "1"
            }
        }
    };
    return JSON.stringify(twitterConfigLocal);
}

function getSampleWidgetConfigJson(widgetKey) {
    var sampleWidgetConfigLocal = {
        rankCard: "4"
    };
    return JSON.stringify(sampleWidgetConfigLocal);
}