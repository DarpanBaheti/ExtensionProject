
function twitterWidget(parameters) {
    this.widgetKey = "Twitter";
    this.parameters = parameters;

    this.renderWidget = function() {
        const card = renderCard(this.widgetKey,2);
        this.loadFollowedUsers(card,this.widgetKey);
        if(parameters.trendingTwitterTopics == "1"){
            this.loadTrendingTwitterTopics(card,this.widgetKey);
        }
        if(parameters.isSignedInStatus == "1") {
            this.loadUserHomeTimeLine(card,this.widgetKey);
        }
    };

    this.loadTrendingTwitterTopics = function (card,widgetKey,order=2) {
        const loc = getWidgetLocalStore("userLocation");
        const apiCall = BASE_SERVLET_URL + "/TwitterTrendServlet" + "?country=" + loc.country;
        let promise1 = fetchWidgetData(apiCall,this.parseData2);
        promise1.then( (data) => {
            cnt = 0;
            for(var i in data){
                cnt += 1;
                if(cnt>5) break;
                const trendingTwitterTopic = data[i];
                const innerWidgetKey = widgetKey + "-trendingTwitterTopicId";
                const topicName = "Trending Topic : " + trendingTwitterTopic;
                this.loadTwitterTopic(card,widgetKey,trendingTwitterTopic,innerWidgetKey,topicName,order);
            }
        });
    };

    this.loadTwitterTopic = function(card,widgetKey,trendingTwitterTopic,innerWidgetKey,topicName,order=2) {
        const queryString = trendingTwitterTopic.replace(" ","%20").replace("#","%23");
        const apiCall = BASE_SERVLET_URL + "/TwitterSearchServlet" + "?query=" + queryString;
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData,order);
    };

    this.loadFollowedUsers = function (card,widgetKey,order=1) {
        followedUsers = this.parameters['followedUsers'];
        for(var userId in followedUsers) {
            if(followedUsers[userId] == "1") {
                const userName = userId;
                const topicName = "@" + userName;
                const innerWidgetKey = this.widgetKey + "-" + userName + "Id";
                this.loadUserTwitterTimeLine(card,this.widgetKey,innerWidgetKey,userName,topicName);
            }
        }
    };

    this.loadUserTwitterTimeLine = function (card,widgetKey,innerWidgetKey,userName,topicName,order=1) {
        apiCall = BASE_SERVLET_URL + "/TwitterUserServlet" + "?user=" + userName;
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData,order);
    };

    this.loadUserHomeTimeLine = function (card,widgetKey,order=0) {
        var uniqueUserId = localStorage.getItem("uniqueUserId");
        apiCall = BASE_SERVLET_URL + "/TwitterHomeTimeline" + "?userId=" + uniqueUserId;
        const topicName = "Recent Feeds";
        const innerWidgetKey = widgetKey + "-" + "MyFeeds" + "Id";
        loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,this.parseData,order);
    };

    this.parseData = function(data) {
        parsedData = new Array();
        var feeds = data;
        for (var i in feeds) {
            let parsedDataPoint = {
                thumb: feeds[i].profileImage,
                title: addlinks(feeds[i].text),
                link: "https://twitter.com/" + feeds[i].userName + "/status/" + feeds[i].id,
                text: ""
            };
            parsedData.push(parsedDataPoint);
        }
        return parsedData;
    };

    this.parseData2 = function (data) {
        return data;
    };
}

//Function modified from Stack Overflow
function addlinks(data) {
    //Add link to all http:// links within tweets
    data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
        return '<a href="'+url+'"  target="_blank">'+url+'</a>';
    });

    //Add link to @usernames used within tweets
    data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
        return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
    });
    //Add link to #hastags used within tweets
    data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
        return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
    });
    return data;
}