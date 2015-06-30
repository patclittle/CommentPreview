chrome.tabs.onUpdated.addListener(function(id,info,tab){
	if(info.status=="complete" && !tab.url.includes("comment")){
		chrome.tabs.executeScript(null, {"file":"mainInjection/JS/jquery-2.1.4.min.js"});
		chrome.tabs.executeScript(null, {"file":"mainInjection/JS/mainInjection.js"});
		chrome.tabs.insertCSS(null,{"file":"mainInjection/CSS/injectedStyle.css"});
	}
});