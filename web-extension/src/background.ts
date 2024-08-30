/// <reference types="firefox-webext-browser"/>

import { login } from './lib/auth';
import browser from 'webextension-polyfill';
import { fetchAuthorized } from './lib/background/fetchAuthorizedBackground';
import { getSettings, removeKnownLanguage, upsertKnownLanguage } from './lib/background/settingsStorage';

async function onContextMenuCreated() {
  if (browser.runtime.lastError) {
    const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });

    if (!currentTab) return;
    await browser.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: function() {
        // TODO: user friendly error code
        // eslint-disable-next-line no-console
        console.error('Error creating context menu item');
      },
    });
  }
}

browser.contextMenus.create({
  id: 'translate-selection',
  title: 'Translate selection',
  contexts: ['selection'],
}, onContextMenuCreated);

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'translate-selection':
      await translateSelection(info, tab);
      break;
  }
});

async function translateSelection(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab) {
  await browser.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/translation_modal.js'],
  });
}

// eslint-disable-next-line
browser.runtime.onMessage.addListener((message, sender, sendResponse: (res: any) => void) => {
  switch (message?.action) {
    case 'login':
      login().then(sendResponse).catch(error => sendResponse({ error: error.toString() }));
      break;
    case 'fetchAuthorized':
      fetchAuthorized(message.endpoint, message.body, message.options)
        .then(sendResponse)
        .catch(error => sendResponse({ error }));
      break;
    case 'settingsStorage.upsertKnownLanguage':
      upsertKnownLanguage(message.name, message.level).then(sendResponse).catch(error => sendResponse({ error: error.toString() }));
      break;
    case 'settingsStorage.removeKnownLanguage':
      removeKnownLanguage(message.name).then(sendResponse).catch(error => sendResponse({ error: error.toString() }));
      break;
    case 'settingsStorage.getSettings':
      getSettings()
        .then(res => 
          // rxdb have a problem if we didn't clone the object
          sendResponse(JSON.parse(JSON.stringify(res)))
        )
        .catch(error => 
          sendResponse({ error: error.toString() })
        );
      break;
  }

  return true;
});
