chrome.tabs.onUpdated.addListener(function(id,info,tab){
	if(info.status=="complete"){
		chrome.tabs.executeScript(null, {"file":"jquery-2.1.4.min.js"});
		chrome.tabs.executeScript(null, {"file":"mainInjection.js"});
		chrome.tabs.insertCSS(null,{"file":"injectedStyle.css"});
	}
});