
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function deleteDiv(divId) {
    var divElement = document.getElementById(divId);
    if(divElement)
        divElement.parentNode.removeChild(divElement);
}

function deleteDivElement(divElement) {
    divElement.parentNode.removeChild(divElement);
}

function deleteAllDiv(divId) {
    var elems = document.querySelectorAll("#" + divId);
    for(var i in elems){
        if(elems[i].parentNode == undefined) continue;
        elems[i].parentNode.removeChild(elems[i]);
    }
}

function getWidgetLocalStore(widgetKey) {
	const localStorageRes = localStorage.getItem(widgetKey);
	const widgetConfig = JSON.parse(localStorageRes);
	return widgetConfig;
}

function setWidgetLocalStore(widgetKey,widgetConfig) {
	const widgetConfigJson = JSON.stringify(widgetConfig);
	localStorage.setItem(widgetKey, widgetConfigJson);
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function getHeadingColor(widgetKey) {
    if(widgetKey == "Reddit") {
        return "#3498DB";
    }
    else if(widgetKey == "Youtube") {
        return "#ff9a9e";
    }
    else if(widgetKey == "Twitter") {
        return "#ffc3a0";
    }
    else if(widgetKey == "SampleWidget") {
        return "#44fab0";
    }
}

// // Close the Settings menu if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.settings-dropbtn')) {

//     var dropdowns = document.getElementsByClassName("settings-dropdown-content ");
//     for (i = 0; i < dropdowns.length; i++){
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }