
// ---------------------------------------------------------------
// --------------------------------------------------------------- Content script for Injecting follow button to subreddit page

function countOccurrences(charSearch,str){
    for(var i=count=0; i<str.length; count+=+(charSearch===str[i++]));
    return count;
}

var subRedditRegEx = new RegExp("https://www.reddit.com/r/.*");
function checkSubRedditUrl(url) {
    if(subRedditRegEx.test(url)) {
        var res = url.split("/r/");
        var cnt = countOccurrences("/",res[1]);
        if(cnt >= 1)
            return false;
        else
            return true;
    }
}

var oldURL = "";
setInterval(function() {
    if(window.location.href != oldURL) {
        var activeUrl = window.location.href;
        if(activeUrl.charAt( activeUrl.length-1 ) == "/") {
            activeUrl = activeUrl.slice(0, -1);
        }
        if(checkSubRedditUrl(activeUrl)){
            var res = activeUrl.split("/r/");
            var subRedditName = res[1];
            addFollowButton(activeUrl,subRedditName);
        }
        oldURL = window.location.href;
    }
}, 1000);

// addFollowButton("https://www.reddit.com/r/aww","aww");
function addFollowButton(subRedditUrl,subRedditName) {
    subRedditHeaderDiv = getSubredditDiv(subRedditUrl);
    if(subRedditHeaderDiv) {
        addButtonToSubreddit(subRedditHeaderDiv, subRedditName);
    }
}

function getSubredditDiv(subRedditUrl) {
    var l = document.links;
    for(var i=0; i<l.length; i++) {
        if(l[i].href == subRedditUrl) {
            return l[i].parentNode;
            break;
        }
    }
    return null;
}

function addButtonToSubreddit(headerDiv,subRedditName)
{
    var followButton = document.createElement('button');
    followButton.setAttribute("type","button");
    followButton.className = "subRedditFollowButton";
    followButton.id = "subRedditFollowButtonId";
    followButton.innerHTML = "Follow r/" + subRedditName;

    followButton.addEventListener('click', function() {
        updateSubRedditList(subRedditName);
    });

    setTimeout(()=>{
        var butonEle = document.getElementById("subRedditFollowButtonId");
        if(butonEle)
            return;
        headerDiv.insertBefore(followButton, headerDiv.firstChild);
    },100);
}

function updateSubRedditList(subRedditName) {
    chrome.runtime.sendMessage({
        type: "redditButtonClicked",
        subRedditName: subRedditName
    });
}