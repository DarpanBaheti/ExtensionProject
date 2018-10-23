
// --------------------------------------------------------------- 
// --------------------------------------------------------------- Render New Tab Page

function renderNewTabPage(toloadWidgetButtons, toloadWidgets) {
    for(var i in toloadWidgetButtons) {
        widgetKey = toloadWidgetButtons[i];
        isActive = false;
        for(var j in toloadWidgets) {
            if(widgetKey == toloadWidgets[j])
                isActive = true;
        }
        renderButtons(widgetKey, isActive);
    }

    for(var i in toloadWidgets) {
        widgetObj = createWidgetObj(toloadWidgets[i]);
        widgetObj.renderWidget();
    }
}

var createWidgetObj = function(widgetKey) {
	if(widgetKey == "Reddit") {
		widgetConfig = getWidgetLocalStore(widgetKey);
		var parameters = widgetConfig['innerCard'];
		return new redditWidget(parameters);
	}
	else if(widgetKey == "Youtube"){
		widgetConfig = getWidgetLocalStore(widgetKey);
		var parameters = widgetConfig['innerCard'];
		return new youtubeWidget(parameters);
	}
	else if(widgetKey == "Twitter") {
        widgetConfig = getWidgetLocalStore(widgetKey);
        var parameters = widgetConfig['innerCard'];
        return new twitterWidget(parameters);
	}
	else {
		return new sampleWidget();
	}
};


// --------------------------------------------------------------- 
// --------------------------------------------------------------- Check local storage on OnLoad

var loadLocalStorage = function() {
	toloadWidgetButtons = new Array();
	toloadWidgets = new Array();

	localStorageRes = localStorage.getItem("widgetStatusList");
	if(localStorageRes === null) {
		//getWidgetList();
	}
	else if(localStorageRes != null) {
		widgetStatusList = JSON.parse(localStorageRes);
		for(var widgetKey in widgetStatusList) {
			toloadWidgetButtons.push(widgetKey);
			if(widgetStatusList[widgetKey] === "1") {
				toloadWidgets.push(widgetKey);
			}
		}
	}

	renderNewTabPage(toloadWidgetButtons, toloadWidgets);

	let loc = localStorage.getItem("userLocation");
	if(loc === null) {
		ipLookUp();
	}
};

window.onload = function() {
	loadLocalStorage();
};