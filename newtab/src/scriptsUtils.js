
// ---------------------------------------------------------------
// --------------------------------------------------------------- Search Functionality

document.getElementById("search-bar").addEventListener("keydown", function(evt) {
    if(evt.keyCode == 13)
        window.location = "https://in.search.yahoo.com/search?p=" + this.value;
});


// ---------------------------------------------------------------
// --------------------------------------------------------------- Get lat & lon

function getUserLocationDetails() {
    let loc = localStorage.getItem("userLocation");
    if(loc === null) {
        ipLookUp();
    }
}

function ipLookUp () {
    var locationApi = "http://ip-api.com/json";
    fetch(locationApi)
        .then(
            function(response) {
                if(response.status !== 200) {
                    console.log('Request failed.  Returned status of', status);
                    return;
                }
                response.json().then(function(data) {
                    let loc = {lat: data.lat, lon: data.lon, countryCode: data.countryCode, country: data.country};
                    localStorage.setItem("userLocation",JSON.stringify(loc));
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch error',err);
        });
}


// ---------------------------------------------------------------
// --------------------------------------------------------------- Generate Unique Id

function generateUniqueUserId (){
    var uniqueUserId = localStorage.getItem("uniqueUserId");
    if(uniqueUserId === null) {
        uniqueUserId = getRandomToken();
        localStorage.setItem("uniqueUserId",uniqueUserId);
    }
}

function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}