
function getRecentUploads(channelName) {
    return new Promise(function(resolve) {
        var newData = new Array();
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/channels',
            type: 'GET',
            dataType: 'json',
            data: {
                'part': 'contentDetails',
                'forUsername': channelName,
                'key': 'AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0'
            },
            success: function (data) {
                var uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
                getVideos(uploads);
            }
        });

        //Use "uploads" value from previous ajax call to retrieve videos
        function getVideos(uploads) {
            var limit = 3;
            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                type: 'GET',
                dataType: 'json',
                data: {
                    'part': 'snippet',
                    'playlistId': uploads,
                    'chart': 'mostPopular',
                    'maxResults': limit,
                    'key': 'AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0'
                },
                success: function (data) {
                    for (var i = 0; i < limit; i++) {
                        var dataPoint = {};
                        const video_id = data.items[i].snippet.resourceId.videoId;
                        dataPoint.thumb = data.items[i].snippet.thumbnails.medium.url;
                        dataPoint.title = data.items[i].snippet.title;
                        dataPoint.link = 'https://www.youtube.com/watch?v=' + video_id;
                        dataPoint.text = "";
                        newData.push(dataPoint);
                    }
                    resolve(newData);
                }
            });
        }
    });
}

function getVideoInfo(listCardItemObj,videoName) {
    this.parseData = function(data) {
        return data;
    };

    return new Promise(function (resolve) {
        const videoId = videoName;
        apiCall = "https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=" + videoId + "&format=json";
        var promise1 = fetchWidgetData(apiCall,this.parseData);
        promise1.then( (data) => {
            var dataInfo = {};
            dataInfo.thumb = data.thumbnail_url;
            dataInfo.title = data.title;
            dataInfo.link = 'https://www.youtube.com/watch?v=' + videoId;
            dataInfo.test = "";
            cardItem = new CardItemObj(dataInfo.thumb,dataInfo.title,dataInfo.link,dataInfo.text);
            listCardItemObj.push(cardItem);
            resolve();
        });
    });
}