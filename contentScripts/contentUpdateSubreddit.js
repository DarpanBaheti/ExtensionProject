
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'updateSubRedditList') {
        console.log("Recieved SubRedditButton clicked message from background");
        var selectionFired = new CustomEvent('updateSubRedditList', {'detail': {"subRedditName": msg.subRedditName}});
        document.dispatchEvent(selectionFired);
    }
});