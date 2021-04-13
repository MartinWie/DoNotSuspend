var doNotSuspends

chrome.tabs.onCreated.addListener(function(tab){
  discardManaging(tab)
});

chrome.tabs.onReplaced.addListener(function(tabId) {
  let tab = chrome.tabs.get(tabId)
  discardManaging(tab)
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  discardManaging(tab)
});

chrome.runtime.onInstalled.addListener(function(details) {
  doNotSuspends = ["troy", "music", "active"]
  chrome.storage.sync.set({'doNotSuspends': doNotSuspends}, function() {});
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      discardManaging(tab)
    });
  });
});

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.get(['doNotSuspends'], function(result) {
    doNotSuspends = result.doNotSuspends
  });
})

function discardManaging(tab){
  if(shouldDiscardBeDisabled(tab)){
    disableAutoDiscardForTab(tab.id);
  }else{
    enableAutoDiscardForTab(tab.id)
  }
}

function disableAutoDiscardForTab(tabId){
  chrome.tabs.update(tabId, {autoDiscardable: false});
}

function enableAutoDiscardForTab(tabId){
  chrome.tabs.update(tabId, {autoDiscardable: true});
}

function shouldDiscardBeDisabled(tab){
  return isTabUrlInList(doNotSuspends,tab)
}

function isTabUrlInList(list,tab){
  if(list.filter(
      entry => isSubStringInDomain(tab,entry)
    ).length > 0){
      return true
  } else {
      return false
  }
}

function isSubStringInDomain(tab,subString){
  return (tab.url.indexOf(subString) != -1)
}

function addToDoNotSuspendList(entry) {
  console.log(entry)
  doNotSuspends.push(entry)
  updateAllTabs()
}

function removeFromDoNotSuspendList(entry) {
  doNotSuspends = doNotSuspends.filter(function(it){
    return it != entry
  })
  updateAllTabs() 
}

function updateAllTabs() {
  chrome.storage.local.set({'doNotSuspends': doNotSuspends});
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if(tab.url.indexOf("http") != -1){
        switch(shouldDiscardBeDisabled(tab)){
          case true:
            disableAutoDiscardForTab(tab.id)
            break;
  
          case false:
            enableAutoDiscardForTab(tab.id)
            break;
        }
      }
    });
  });
}
