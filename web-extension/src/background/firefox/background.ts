/// <reference types="firefox-webext-browser"/>

import { login } from '../../lib/auth';

async function onContextMenuCreated() {
  if (browser.runtime.lastError) {
    const currentTab = await browser.tabs.getCurrent();

    await browser.tabs.executeScript(currentTab.id, {
      // TODO: user friendly error code
      code: 'console.error("Error creating context menu item");',
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

async function translateSelection(info: browser.contextMenus.OnClickData, tab: browser.tabs.Tab) {
  await browser.tabs.executeScript(tab.id, {
    file: 'scripts/translation_modal.js',
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === 'login') {
    login().then(sendResponse).catch(error => sendResponse({ error }));
    return true;
  }
});
