chrome.runtime.onInstalled.addListener(function(details) {
  doNotSuspends = ["troy", "music", "ikaros"]
  saveDoNotSuspendsLocal(doNotSuspends)
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      discardTab(tab)
    });
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  discardTab(tab)
});

chrome.tabs.onReplaced.addListener((tabId) => {
  let tab = chrome.tabs.get(tabId)
  discardTab(tab)
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  discardTab(tab)
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getList"){
      loadDoNotSuspendsLocal(sendResponse)
      return true
    }
      
    if (request.action == "remove"){
      removeFromDoNotSuspendList(request.value);
      return true
    }

    if (request.action == "add"){
      addToDoNotSuspendList(request.value);
      return true
    }
    
    console.log("How did we get here?!")
  }
);

function discardTab(tab){
  chrome.storage.local.get(['doNotSuspends'], (result) => {
    doNotSuspendsLoaded = result.doNotSuspends 
    if(isTabUrlInList(doNotSuspendsLoaded,tab)){
      disableAutoDiscardForTab(tab.id);
    }else{
      enableAutoDiscardForTab(tab.id)
    }
  });
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

function updateAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(function(tab) {
      if(tab.url.indexOf("http") != -1){
        discardTab(tab)
      }
    });
  });
}

function saveDoNotSuspendsLocal(doNotSuspends) {
  chrome.storage.local.set({'doNotSuspends': doNotSuspends}, () => {});
}

 function loadDoNotSuspendsLocal(callback){ 
  chrome.storage.local.get(['doNotSuspends'], (result) => { 
    callback(result.doNotSuspends)
  });
}

 function addToDoNotSuspendList(entry) {
  chrome.storage.local.get(['doNotSuspends'], (result) => {
    let doNotSuspendsLoaded = result.doNotSuspends
    doNotSuspendsLoaded.push(entry)
    updateAllTabs()
    saveDoNotSuspendsLocal(doNotSuspendsLoaded)
  });
}

 function removeFromDoNotSuspendList(entry) {
  chrome.storage.local.get(['doNotSuspends'], (result) => {
    let doNotSuspendsLoaded = result.doNotSuspends
    doNotSuspendsLoaded = doNotSuspendsLoaded.filter((it) => {
      return it != entry
    })
    updateAllTabs()
    saveDoNotSuspendsLocal(doNotSuspendsLoaded)
  });
}