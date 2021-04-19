chrome.runtime.onInstalled.addListener(function(details) {
  doNotSuspends = ["troy", "music", "active"]
  saveDoNotSuspendsLocal(doNotSuspends)
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      discardManaging(tab)
    });
  });
});

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

function discardManaging(tab){
  if(shouldDiscardBeDisabled(tab)){
    disableAutoDiscardForTab(tab.id);
  }else{
    enableAutoDiscardForTab(tab.id)
  }
}

function shouldDiscardBeDisabled(tab){
  return isTabUrlInList(loadDoNotSuspendsLocal(),tab)
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

function disableAutoDiscardForTab(tabId){
  chrome.tabs.update(tabId, {autoDiscardable: false});
}

function enableAutoDiscardForTab(tabId){
  chrome.tabs.update(tabId, {autoDiscardable: true});
}

function addToDoNotSuspendList(entry) {
  let doNotSuspends = loadDoNotSuspendsLocal()
  doNotSuspends.push(entry)
  updateAllTabs()
  saveDoNotSuspendsLocal(doNotSuspends)
}

function removeFromDoNotSuspendList(entry) {
  let doNotSuspends = loadDoNotSuspendsLocal()
  doNotSuspends = doNotSuspends.filter(function(it){
    return it != entry
  })
  updateAllTabs()
  saveDoNotSuspendsLocal(doNotSuspends) 
}

function updateAllTabs() {
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

function saveDoNotSuspendsLocal(doNotSuspends) {
  chrome.storage.local.set({'doNotSuspends': doNotSuspends}, function() {});
}

function saveDoNotSuspendsSync(doNotSuspends) {
  chrome.storage.sync.set({'doNotSuspends': doNotSuspends}, function() {});
}

function loadDoNotSuspendsLocal(){
  let doNotSuspendsLoaded
  chrome.storage.local.get(['doNotSuspends'], function(result){
    doNotSuspendsLoaded = result.doNotSuspends
  });
  return doNotSuspendsLoaded
}

function loadDoNotSuspendsSync(){
  let doNotSuspendsLoaded
  chrome.storage.sync.get(['doNotSuspends'], function(result){
    doNotSuspendsLoaded = result.doNotSuspends
  });
  return doNotSuspendsLoaded
}