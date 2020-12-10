chrome.browserAction.onClicked.addListener(function(tab) {

			chrome.tabs.executeScript({
				file: 'main.js'
			});

			chrome.tabs.insertCSS({
 				file: 'main.css'
			}, function(callback) {});


	}
);
