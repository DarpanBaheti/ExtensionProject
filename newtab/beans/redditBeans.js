function redditWidget(parameters) {
    this.widgetKey = "Reddit";
    this.apiUrl = "https://www.reddit.com/";
    this.parameters = parameters;
    this.userAgent = "Extension";
    this.clientId = "iYzb1bqskWDaDg";
    this.clientSecret = "PodkAe4ExHY_7cb1S45nH726ln4";

    this.renderWidget = function() {
        const card = renderCard(this.widgetKey,1);
        if(parameters.isSignedInStatus == "1") {
            this.loadUserHomeTimeLine(card,this.widgetKey);
        }
        if(parameters.trendingPost == "1") {
            this.loadTrendingPost(card,this.widgetKey);
        }
        if(parameters.trendingSubReddits == "1"){
            this.loadTrendingSubReddits(card,this.widgetKey);
        }
        for(var subRedditName in parameters["subRedditLists"]){
            if(parameters["subRedditLists"][subRedditName] == "1") {
                const innerWidgetKey = this.widgetKey + "-" + subRedditName + "Id";
                const topicName = "/r/" + subRedditName;
                this.loadSubRedditsPost(card,this.widgetKey,subRedditName,innerWidgetKey,topicName);
            }
        }
    };

    this.loadUserHomeTimeLine = function(card,widgetKey,order=0) {
        const innerWidgetKey = widgetKey + "-" + "HomeFeeds" + "Id";
        const topicName = "Home Feeds";

        let widgetConfig = getWidgetLocalStore(widgetKey);
        let parameters = widgetConfig['innerCard'];
        let refresh_token = parameters['refresh_token'];
        const r = new snoowrap({
            userAgent: this.userAgent,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            refreshToken: refresh_token
        });
        r.getHot().then(data => {
            var listCardItemObj = new Array();
            let cnt = 1;
            for(var i in data) {
                if(cnt > 10)
                    break;
                cnt += 1;
                dataInfo = data[i];
                if(dataInfo.thumbnail == "self" || dataInfo.thumbnail == "" || dataInfo.thumbnail == "default" || dataInfo.thumbnail == "nsfw" || dataInfo.thumbnail == undefined || dataInfo.thumbnail == null)
                    dataInfo.thumbnail = "style/images/reddit_default.jpg";
                cardItem = new CardItemObj(dataInfo.thumbnail,dataInfo.title + "<br> [ " + dataInfo.subreddit_name_prefixed + " ]","https://www.reddit.com" + dataInfo.permalink, dataInfo.subreddit_name_prefixed);
                listCardItemObj.push(cardItem);
            }
            renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,order);
        });
    };

    this.loadTrendingPost = function(card,widgetKey,order=1) {
        apiCall = this.apiUrl + "hot.json?sort=hot&limit=3";
        const topicName = "Trending Posts";
        const innerWidgetKey = widgetKey + "-TrendingPostId";
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData1,order);
    };

    this.loadTrendingSubReddits = function(card,widgetKey,order=2) {
        apiCall = this.apiUrl + "api/trending_subreddits.json";
        var promise1 = fetchWidgetData(apiCall,this.parseData2);
        promise1.then( (data) => {
            subRedditList = data["subreddit_names"];
            cnt = 0;
            for(var i in subRedditList){
                cnt += 1;
                if(cnt>3) break;
                subRedditName = subRedditList[i];
                const innerWidgetKey = widgetKey + "-trendingSubRedditsId";
                const topicName = "Trending Subreddits : /r/" + subRedditName;
                this.loadSubRedditsPost(card,widgetKey,subRedditName,innerWidgetKey,topicName,order);
            }
        });
    };

    this.loadSubRedditsPost = function(card,widgetKey,subRedditName,innerWidgetKey,topicName,order=3) {
        apiCall = this.apiUrl + "r/" + subRedditName + "/" + "hot.json?sort=hot&limit=3";
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData1,order);
    };

    this.parseData1 = function(data) {
        parsedData = new Array();
        dataInfo = data["data"]["children"];
        for(var i in dataInfo)
        {
            postInfo = dataInfo[i]["data"];
            if(postInfo.thumbnail == "self" || postInfo.thumbnail == "" || postInfo.thumbnail == "default" || postInfo.thumbnail == "nsfw" || postInfo.thumbnail == undefined || postInfo.thumbnail == null)
                postInfo.thumbnail = "style/images/reddit_default.jpg";
            let parsedDataPoint = {
                thumb: postInfo.thumbnail,
                title: postInfo.title,
                link: "http://reddit.com" + postInfo.permalink,
                text: postInfo.author + " " + postInfo.subreddit_name_prefixed
            };
            parsedData.push(parsedDataPoint);
        }
        return parsedData;
    };

    this.parseData2 = function(data) {
        return data;
    }
}