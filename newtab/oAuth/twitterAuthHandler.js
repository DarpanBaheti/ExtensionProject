
let params = (new URL(document.location)).searchParams;
// let twitterSignedInStatus = params.get("twitterSignedInStatus");
// console.log(twitterSignedInStatus);
if(params.has("twitterSignedInStatus")) {
    /* Cross Origin Post Message */
    // let targetWindow = window.opener;
    // targetWindow.postMessage('twitterSignedInStatus', 'http://localhost:8000');

    /* Local Storage Update as Same Origin */
    widgetKey = "Twitter";
    const localStorageRes = localStorage.getItem(widgetKey);
    const widgetConfig = JSON.parse(localStorageRes);
    widgetConfig["innerCard"]["isSignedInStatus"] = "1";
    const widgetConfigJson = JSON.stringify(widgetConfig);
    localStorage.setItem(widgetKey, widgetConfigJson);
}
// window.opener.location.reload();
// let loc = localStorage.getItem("userLocation");
// console.log(loc);
window.close();