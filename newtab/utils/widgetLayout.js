
function attachCloseBut(widgetKey,card) {
	const aTag = document.createElement('a');
	setAttributes(aTag, {"href": "#", "id": "close-card-icon"});

	var widgetDivId = widgetKey + "Id";
	aTag.addEventListener('click',function() {
        const menuCheckboxId = widgetKey + "Add";
        const menuCheckbox = document.getElementById(menuCheckboxId);
        if(menuCheckbox.checked == true)
            menuCheckbox.checked = false;

		var divElement = document.getElementById(widgetDivId);
		if(divElement) {
			deleteDiv(widgetDivId);
			localStorageRes = localStorage.getItem("widgetStatusList");
			widgetStatusList = JSON.parse(localStorageRes);
			widgetStatusList[widgetKey] = "0";
			localStorage.setItem("widgetStatusList", JSON.stringify(widgetStatusList));
		}
	});

	card.appendChild(aTag);
}

function attachSetBut(widgetKey,card) {
	const settingsDiv = document.createElement('div');
	setAttributes(settingsDiv,{"class":"settings-dropdown"});
	const aTag = document.createElement('a');
	setAttributes(aTag, {"href": "#", "class": "settings-dropbtn", "id": "settings-card-icon"});

	aTag.addEventListener('click',function() {
    	document.getElementById(widgetKey + "-settings-content").classList.toggle("show");
	});

	const settingsContentDiv = getSettingsContent(widgetKey);

	settingsDiv.appendChild(aTag);
	settingsDiv.appendChild(settingsContentDiv);

	card.appendChild(settingsDiv);	
}

function CardItemObj(imgSrc,title,href,text) {
	this.imgSrc= imgSrc;
	this.title = title;
	this.href = href;
	this.text = text;

	this.getCardItem = function() {
		const cardItem = document.createElement('div');
		setAttributes(cardItem,{"class":"cardItem"});

		const itemImg = document.createElement('img');
		setAttributes(itemImg,{"class":"item-image","src":this.imgSrc});
		const imgLink = document.createElement('a');
		setAttributes(imgLink,{"href":this.href});
		imgLink.appendChild(itemImg);

		const itemTextContainer = document.createElement('div');
		setAttributes(itemTextContainer,{"class":"itemTextContainer"});
		itemTextContainer.innerHTML = this.title;

		cardItem.appendChild(imgLink);
		cardItem.appendChild(itemTextContainer);

		return cardItem;	
	}
}

function renderCard(widgetKey) {
	const container  = document.getElementById('container');
	const card = document.createElement('div');
	setAttributes(card,{"class":"card","id":widgetKey+"Id"});

	attachCloseBut(widgetKey,card);
	attachSetBut(widgetKey,card);

	const h1 = document.createElement('h1');
	h1.textContent = widgetKey;
	h1.style.background = getHeadingColor(widgetKey);
	card.appendChild(h1);

	container.insertBefore(card, container.childNodes[0]);

    return card;
}

function renderInnerCard(card,widgetKey,innerWidgetKey,topic,listCardItemObj,order) {
	const innerCard = document.createElement('div');
	setAttributes(innerCard,{"class":"innerCard","id":innerWidgetKey,"order":order});

    const button = document.createElement('button');
	setAttributes(button,{"class":"collapsible"});
	button.innerHTML = topic;
	button.addEventListener("click", function() {
    	this.classList.toggle("active");
    	var content = this.nextElementSibling;
    	if (content.style.display === "block") {
      		content.style.display = "none";
    	} else {
      		content.style.display = "block";
    	}
  	});
	innerCard.appendChild(button);

	const div = document.createElement('div');
	setAttributes(div,{"class":"collapsible-content"});

	for(var i in listCardItemObj) {
		div.appendChild(listCardItemObj[i].getCardItem());
	}
	innerCard.appendChild(div);
	doReorderBeforeAppend(card,widgetKey,innerCard);
	// card.appendChild(innerCard);
}

function orderSort(a,b) {
	return ($(a).attr('order') > $(b).attr('order')) ? 1 : -1;
}

function doReorderBeforeAppend(card,widgetKey,innerCard) {
    var divArr = new Array();
    var divChilds = document.getElementById(widgetKey + "Id").children;
    for (i = 0; i <= divChilds.length - 1; i++) {
        if(divChilds[i].className == "innerCard") {
            divArr.push(divChilds[i]);
        }
    }
    divArr.push(innerCard);
    divArr = divArr.sort(orderSort);
	for (var i=0; i<divArr.length;i++) {
        card.appendChild(divArr[i]);
   	}
}