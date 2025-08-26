// Chrome擴充功能後台服務工作者
// 處理快捷鍵、截圖API調用和訊息中繼

import { startScreenshot, startFullScreenshot, startScrollingScreenshot, captureCurrentTab } from './background/capture.js';
import { saveApiKey, getApiKey } from './background/storage.js';

// 監聽快捷鍵命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'take-screenshot') {
    startScreenshot();
  } else if (command === 'full-screenshot') {
    startFullScreenshot();
  }
});

// 監聽來自popup和content script的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true; // 保持訊息通道開放以進行異步響應
});

async function handleMessage(request, sender, sendResponse) {
  console.log(`[background.js] Received action: ${request.action}`, request);
  try {
    switch (request.action) {
      case 'startScreenshot':
        await startScreenshot();
        sendResponse({ success: true });
        break;

      case 'fullScreenshot':
        await startFullScreenshot();
        sendResponse({ success: true });
        break;

      case 'startScrollingScreenshot':
        await startScrollingScreenshot();
        sendResponse({ success: true });
        break;

      case 'captureTab':
        const imageData = await captureCurrentTab();
        sendResponse({ success: true, imageData });
        break;

      case 'saveApiKey':
        await saveApiKey(request.apiKey);
        sendResponse({ success: true });
        break;

      case 'getApiKey':
        const apiKey = await getApiKey();
        sendResponse({ success: true, apiKey });
        break;

      case 'ping': // 新增一個ping來檢查content script是否存在
        sendResponse({ success: true, message: 'pong' });
        break;

      default:
        sendResponse({ success: false, error: '未知的操作' });
    }
  } catch (error) {
    console.error('處理訊息時發生錯誤:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// 擴充功能安裝時的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('Screenshot to imgBB 擴充功能已安裝');
});