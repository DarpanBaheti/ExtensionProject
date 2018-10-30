
function fetchWidgetData(apiCall,parseData) {
	return new Promise(function(resolve) {
		fetch(apiCall)
		.then(
			function(response) {
				if(response.status !== 200) {
					console.log("There was a problem. Status code: " + response.status);
					return;
				}
				response.json().then(function(data) {
					data = parseData(data);
					resolve(data);
				});		
			}
		)
		.catch(function(err) {
			console.log('Fetch error',err);
		});
	});
}

function constructListCardItemObj(apiCall,parseData) {
	var listCardItemObj = new Array();
	return new Promise((resolve, reject) => {
		var promise1 = fetchWidgetData(apiCall,parseData);
		promise1.then( (data) => {
			// console.log(data);
			for(var i in data) {
				dataInfo = data[i];
				cardItem = new CardItemObj(dataInfo.thumb,dataInfo.title,dataInfo.link,dataInfo.text);
				listCardItemObj.push(cardItem);
			}
			resolve(listCardItemObj);
		});
	});
}

function loadInnerCard(apiCall,card,widgetKey,innerWidgetKey,topicName,parseData,order) {
	var promise1 = constructListCardItemObj(apiCall,parseData);
	promise1.then( (listCardItemObj) => {

		renderInnerCard(card,widgetKey,innerWidgetKey,topicName,listCardItemObj,order);
	});
}


// --------------------------------------------------------------- 
// --------------------------------------------------------------- Widget Component

function sampleWidget() {
	this.widgetKey = "SampleWidget";

	this.renderWidget = function() {
		listCardItemObj = new Array();
		listCardItemObj.push(new CardItemObj('http://placehold.it/70x50','Title1','#',''));
		listCardItemObj.push(new CardItemObj('http://placehold.it/70x50','Title2','#',''));

		const card = renderCard(this.widgetKey,4);
		const topicName = "Sample Feed";
		const innerWidgetKey = this.widgetKey + "-SampleFeed"
		renderInnerCard(card,this.widgetKey,innerWidgetKey,topicName,listCardItemObj);
	}
}


