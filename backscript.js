
// ---------------------------------------------------------------
// --------------------------------------------------------------- Notification Logic

var delay = 24 * 60 * 60 * 1000;
delay = 10000;
setInterval(function() {
    getWidgetList();
}, delay);

function getWidgetList() {
    var widgetListApi = "http://localhost:8081/getWidgetList";
    fetch(widgetListApi)
        .then(
            function(response) {
                if(response.status !== 200) {
                    console.log('Request failed.  Returned status of', status);
                    return;
                }
                response.json().then(function(data) {
                    diffOfList = getDiffOfList(data);
                    popNotification(diffOfList);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch error',err);
        });
}

function getDiffOfList(widgetData) {
    var diffOfList = new Array();

    var widgetList = {};
    localStorageRes = localStorage.getItem("widgetList");
    if(localStorageRes === null) {
        for(var i in widgetData) {
            diffOfList.push(widgetData[i]);
            widgetList[widgetData[i]] = "0";
        }
    }
    else {
        widgetList = JSON.parse(localStorageRes);
        for(var i in widgetData) {
            let isFlag = 0;
            for(var key in widgetList) {
                if(widgetData[i] == key)
                    isFlag = 1;
            }
            if(isFlag == 0) {
                diffOfList.push(widgetData[i]);
                widgetList[widgetData[i]] = "0";
            }
        }
    }
    localStorage.setItem("widgetList", JSON.stringify(widgetList));
    return diffOfList;
}

function popNotification(diffOfList) {
    if(typeof diffOfList != "undefined" && diffOfList != null && diffOfList.length != null && diffOfList.length > 0) {

        console.log("Found diff in widget list");
        sendUpdateLocalStorage(diffOfList);

        var options = {
            type: "basic",
            title: "Extension widget update",
            message: "New Widgets!",
            iconUrl: "icons/16x16.png",
        };
        chrome.notifications.create(options);
    }
}

function sendUpdateLocalStorage(diffOfList) {
    // chrome.tabs.query({active: true}, function(tabs){
    //     console.log("Sending UpdateLocalStorage message from background to content Script");
    //     chrome.tabs.sendMessage( tabs[0].id, {action: "updateLocalStorage", data: diffOfList}, function(response) {});
    // });
    chrome.tabs.query({},function(tabs){
        tabs.forEach(function(tab){
            if(tab.url.startsWith("http://localhost:8000/newtab/index.html")) {
                chrome.tabs.sendMessage( tab.id, {action: "updateLocalStorage", data: diffOfList}, function(response) {});
            }
        });
    });
}


// ---------------------------------------------------------------
// --------------------------------------------------------------- Reload New Tab

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "reloadNewTabs":
            console.log("Recieved reload new tabs request from content");
            reloadNewTabPage();
    }
    return true;
});

reloadNewTabPage = function() {
    chrome.tabs.query({},function(tabs){
        tabs.forEach(function(tab){
            if(tab.url.startsWith("http://localhost:8000/newtab/index.html")) {
                chrome.tabs.reload(tab.id);
                console.log("New Tabs Reloaded!!")
            }
        });
    });
};


// ---------------------------------------------------------------
// --------------------------------------------------------------- Update SubRedditList

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type == 'redditButtonClicked') {
        console.log("Background redditButtonClicked");
        chrome.tabs.query({},function(tabs){
            tabs.forEach(function(tab){
                if(tab.url.startsWith("http://localhost:8000/newtab/index.html")) {
                    chrome.tabs.sendMessage( tab.id, {action: "updateSubRedditList", subRedditName: msg.subRedditName}, function(response) {});
                }
            });
        });
    }
});