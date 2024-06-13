/// <reference types="firefox-webext-browser"/>

import { login } from './lib/auth';
import browser from 'webextension-polyfill';
import { fetchAuthorized } from './lib/background/fetchAuthorizedBackground';

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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message?.action) {
    case 'login':
      // @ts-ignore
      login().then(sendResponse).catch(error => sendResponse({ error: error.toString() }));
      break;
    case 'fetchAuthorized':
      fetchAuthorized(message.endpoint, message.body, message.options)
        .then(sendResponse)
        // @ts-ignore
        .catch(error => sendResponse({ error }));
      break;
  }

  return true;
});
