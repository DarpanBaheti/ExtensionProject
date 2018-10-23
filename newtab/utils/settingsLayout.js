
function getSettingsContent(widgetKey) {
	const settingsContentDiv = document.createElement('div');
	setAttributes(settingsContentDiv,{"class":"settings-dropdown-content","id": widgetKey + "-settings-content"});
	
	settingsContentDiv.innerHTML = getSettingHeader(widgetKey); 

	if(widgetKey == "Reddit") {
		settingsContentDiv.innerHTML += getRedditSettingsContent(widgetKey);
	}
	if(widgetKey == "Youtube") {
        settingsContentDiv.innerHTML += getYoutubeSettingsContent(widgetKey);
    }
    if(widgetKey == "Twitter") {
    	settingsContentDiv.innerHTML += getTwitterSettingsContent(widgetKey);
	}

	settingsContentDiv.innerHTML += getSettingClose(widgetKey);

    $("#container").off("click", "#" + widgetKey + "-done");
	$("#container").on("click", "#" + widgetKey + "-done", function() {
		hide_settings(widgetKey + "-settings-content");
	});

	return settingsContentDiv;
}

function getSettingHeader(widgetKey) {
	return "<div class='settings-items-header'><h2>" + "Configure " + widgetKey + "</h2><hr/></div>";
}

function getSettingClose(widgetKey) {
	return "<button class='settings-button' id=" + widgetKey + "-done>Done</button>";
}

function hide_settings(settingsId) {
	const settingsMenu = document.getElementById(settingsId);
	if (settingsMenu.classList.contains('show')) {
    	settingsMenu.classList.remove('show');
 	}
}

function getSelectForm(widgetKey,widgetFormKey,listOfElements) {
    const formHtml1 = "<form><div class='multiselect'><button class='plus-button before after' id='" + widgetFormKey + "-selectBox'></button><div class='settings-list-checkboxes' id='" + widgetFormKey + "-checkboxes'>";
    var listEl = "";
    for(var elName in listOfElements) {
    	const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
    	var elHtml = "";
    	if(listOfElements[elName] == "0") {
    		elHtml = "<label><input type='checkbox'id='" + elCheckboxId + "'/>" + elName + "</label>";
    	}
    	else{
    		elHtml = "<label><input type='checkbox'id='" + elCheckboxId + "' checked/>" + elName + "</label>";
    	}
    	listEl += elHtml;
    }    
    const formHtml2 = "</div></div></form>";
    return formHtml1 + listEl + formHtml2;
}


function showCheckboxes(checkboxesId) {
    const checkboxes = document.getElementById(checkboxesId);
    if (checkboxes.style.display == "block") {
        checkboxes.style.display = "none";
    }
    else {
        checkboxes.style.display = "block";
    }
}