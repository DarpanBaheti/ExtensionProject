// ---------------------------------------------------------------
// --------------------------------------------------------------- Load Button

function renderButtons(widgetKey, isActive) {
    const checkCont = document.createElement('div');
    checkCont.setAttribute('class', 'checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = widgetKey + "Add";
    checkbox.class = "menu-checkbox";
    if(isActive)
        checkbox.checked = true;

    var widgetDivId = widgetKey + "Id";

    $('body').off("change", "#" + widgetKey + "Add");
    $('body').on("change", "#" + widgetKey + "Add", function(event) {
        if (event.target.checked) {
            var divElement = document.getElementById(widgetDivId);
            if(divElement)
                return;
            widgetObj = createWidgetObj(widgetKey);
            widgetObj.renderWidget();

            localStorageRes = localStorage.getItem("widgetStatusList");
            if(localStorageRes != null)
                widgetStatusList = JSON.parse(localStorageRes);
            else
                widgetStatusList = {};
            widgetStatusList[widgetKey] = "1";
            localStorage.setItem("widgetStatusList", JSON.stringify(widgetStatusList));

            if(widgetKey == "Youtube") {
                setTimeout(() => {
                    let widgetConfig = getWidgetLocalStore(widgetKey);
                    if (widgetConfig["innerCard"]["isSignedInStatus"] == "1")
                        updateSigninStatus(true);
                    else
                        updateSigninStatus(false);
                }, 100);
            }
        }
        else {
            var divElement = document.getElementById(widgetDivId);
            if(divElement) {
                deleteDiv(widgetDivId);
                localStorageRes = localStorage.getItem("widgetStatusList");
                widgetStatusList = JSON.parse(localStorageRes);
                widgetStatusList[widgetKey] = "0";
                localStorage.setItem("widgetStatusList", JSON.stringify(widgetStatusList));
            }
        }
    });

    checkCont.innerHTML = widgetKey + "  ";
    checkCont.appendChild(checkbox);

    const dropupContent  = document.getElementById('dropup-content');
    dropupContent.appendChild(checkCont);
}