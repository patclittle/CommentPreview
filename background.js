chrome.tabs.onUpdated.addListener(function(id,info,tab){
	chrome.tabs.executeScript(null, {"file":"mainInjection.js"});
});