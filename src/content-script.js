import './content-script.css';
import { startScreenshotSelection, cleanupSelection } from './content/selection.js';
import { showNotification, showFilenamePrompt } from './content/ui.js';
import { copyToClipboard } from './content/utils.js';
import { initiateScrollingCapture } from './content/scrolling.js';
import { cropImage } from './content/image.js';

// 監聽來自背景腳本的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sendResponse);
  return true;
});

function handleMessage(request, sendResponse) {
  switch (request.action) {
    case 'startSelection':
      startScreenshotSelection();
      sendResponse({ success: true });
      break;

    case 'copyToClipboard':
      copyToClipboard(request.text);
      sendResponse({ success: true });
      break;

    case 'showNotification':
      showNotification(request.message, request.type);
      sendResponse({ success: true });
      break;

    case 'promptForFilename':
      showFilenamePrompt(request.imageData);
      sendResponse({ success: true });
      break;

    case 'initiateScrollingCapture':
      initiateScrollingCapture();
      sendResponse({ success: true });
      break;

    case 'ping':
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, error: '未知的操作' });
  }
}
