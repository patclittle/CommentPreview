chrome.tabs.onUpdated.addListener(function(id,info,tab){
	chrome.tabs.executeScript(null, {"file":"mainInjection.js"});
	chrome.tabs.executeScript(null, {"file":"jquery-2.1.4.min.js"});
});