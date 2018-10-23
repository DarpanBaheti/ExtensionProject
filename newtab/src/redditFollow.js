
// ---------------------------------------------------------------
// --------------------------------------------------------------- Content Script Update

document.addEventListener("updateSubRedditList", function (e) {
    console.log("UpdateSubRedditList message recieved on New Tab Page");
    checkSubRedditList(e.detail.subRedditName);
});

function checkSubRedditList(subRedditName) {
    const widgetKey = "Reddit";
    const widgetConfig = getWidgetLocalStore(widgetKey);
    const parameters = widgetConfig['innerCard'];
    const listOfElements = parameters['subRedditLists'];

    var isPresent = false;
    for(var elName in listOfElements) {
        if (subRedditName == elName) {
            isPresent = true;
        }
    }
    if(isPresent == false) {
        addToSubRedditList(widgetKey,subRedditName);
        console.log(subRedditName);
        widgetConfig['innerCard']['subRedditLists'][subRedditName] = "1";
        console.log(widgetConfig);
        setWidgetLocalStore(widgetKey,widgetConfig);
    }
}

function addToSubRedditList(widgetKey,subRedditName) {
    const card = document.getElementById(widgetKey + "Id");
    const subRedditCheckBoxList = document.getElementById(widgetKey+"-follow-checkboxes");

    const elName = subRedditName;
    const elId = widgetKey + "-" + elName + "Id";
    const elCheckboxId = widgetKey + "-" + elName + "CheckboxId";
    const elTopicName = "/r/" + elName;
    const elHtml = "<label><input type='checkbox'id='" + elCheckboxId + "' checked/>" + elName + "</label>";
    const elCheckbox = createElementFromHTML(elHtml);

    attachUpdateInnerCard(card,widgetKey,subRedditName);

    subRedditCheckBoxList.appendChild(elCheckbox);

    new redditWidget("params").loadSubRedditsPost(card,widgetKey,elName,elId,elTopicName);


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

function attachUpdateCloseBut(innerCard,subRedditName) {
    const aTag = document.createElement('a');
    setAttributes(aTag, {"href": "#", "id": "close-innerCard-icon"});

    aTag.addEventListener('click',function() {
        var divElement = document.getElementById(subRedditName + "-update-innerCard");
        if(divElement) {
            deleteDiv(subRedditName + "-update-innerCard");
        }
    });

    innerCard.appendChild(aTag);
}

function attachUpdateInnerCard(card,widgetKey,subRedditName) {
    const innerCard = document.createElement('div');
    setAttributes(innerCard,{"class":"innerCard","id":subRedditName + "-update-innerCard"});

    attachUpdateCloseBut(innerCard,subRedditName);

    const h4 = document.createElement('h4');
    h4.textContent = "Updated! /r/" + subRedditName;
    h4.style.color = "#ff0000";
    h4.style.textAlign = "center";

    innerCard.appendChild(h4);
    card.insertBefore(innerCard,card.firstChild.nextSibling);
}