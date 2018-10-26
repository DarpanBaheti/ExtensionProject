function youtubeWidget(parameters) {
    this.widgetKey = "Youtube";
    this.apiUrl = "http://localhost:8081/YoutubeServlet";
    this.parameters = parameters;
    this.loc = getWidgetLocalStore("userLocation");

    this.vidCategoryMap = {
        Videos: "0",
        Music: "10",
        Sports:"17",
    };

    this.renderWidget = function() {
        const card = renderCard(this.widgetKey,3);
        this.loadTrendingCats(card,this.widgetKey,1);
        this.loadChannels(card,this.widgetKey,2);

        // if(parameters.likedVideosStatus == "1") {
        //     this.loadLikedVideos(card,this.widgetKey,3);
        // }
    };

    this.loadTrendingCats = function (card,widgetKey,order=1) {
        trendingCat = this.parameters["trendingCatLists"];
        for(var vidCategoryID in trendingCat) {
            if(trendingCat[vidCategoryID].status == "1") {
                const topicName = "Trending " + vidCategoryID;
                const innerWidgetKey = widgetKey + "-" +  vidCategoryID + "Id";
                this.loadTrendingCat(card,widgetKey,innerWidgetKey,vidCategoryID,topicName,order);
            }
        }
    };

    this.loadTrendingCat = function (card,widgetKey,innerWidgetKey,vidCategoryID,topicName,order=1) {
        trendingCat = this.parameters["trendingCatLists"];
        let loc = getWidgetLocalStore("userLocation");
        if(trendingCat[vidCategoryID].loc == "self")
            apiCall = this.apiUrl + "?" + "countryCode=" + loc.countryCode;
        else
            apiCall = this.apiUrl + "?" + "countryCode=" + "world";
        apiCall += "&" + "vidCategoryID=" + this.vidCategoryMap[vidCategoryID];
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData,order);
    };

    this.loadChannels = function (card,widgetKey,order=2) {
    	channelsList = this.parameters["channelsList"];
    	for(var channelName in channelsList) {
            if (channelsList[channelName] == "1") {
                const innerWidgetKey = widgetKey + "-" + channelName + "Id";
                const topicName = "Channel: " + channelName;
                this.loadChannel(card, widgetKey, innerWidgetKey,channelName,topicName,order);
            }
        }
    };

    this.loadChannel = function (card,widgetKey,innerWidgetKey,channelName,topicName, order=2) {
    	var listCardItemObj = new Array();
    	var promise1 = getRecentUploads(channelName);
    	promise1.then( (data) => {
    		for(var i in data) {
    			dataInfo = data[i];
    			cardItem = new CardItemObj(dataInfo.thumb,dataInfo.title,dataInfo.link,dataInfo.text);
    			listCardItemObj.push(cardItem);
    		}
    		renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,order);
    	});
    };

    this.loadLikedVideos = function(card,widgetKey,order=3) {
        likedVideosList = this.parameters["likedVideos"];

        const innerWidgetKey = widgetKey + "-Liked" + "videos";
        const topicName = "Liked Videos";

        var addRequests = [];
        var listCardItemObj = new Array();
        for(var videoName in likedVideosList) {
            addRequests.push(getVideoInfo(listCardItemObj, videoName));
        }

        Promise.all(addRequests).then(function(){
            renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,order);
        });
    };

    this.parseData = function(data) {
        return data;
    };
}