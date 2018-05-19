console.log('Loaded');
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("localpage.html") });
});
