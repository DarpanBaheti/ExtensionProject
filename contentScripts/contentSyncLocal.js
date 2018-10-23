

// ---------------------------------------------------------------
// --------------------------------------------------------------- Sync Local Storage Message Passing

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'updateLocalStorage') {
        var diffOfList = msg.data;
        console.log("Recieved updateLocalStorage message from background. Forwarding to script.js");
        var selectionFired = new CustomEvent('updateLocalStorage', {'detail': {"data": diffOfList}});
        document.dispatchEvent(selectionFired);
    }
});

document.addEventListener("reloadNewTabs", function (e) {
    console.log("Recieved reloadNewTabs request from script.js. Forwarding to background");
    chrome.runtime.sendMessage({
		type: "reloadNewTabs",
		params: {
			message: e.detail.message
		}
	});
});