import { showNotification, showFilenamePrompt } from './ui.js';
import { sleep } from './utils.js';
import { stitchImages } from './image.js';

export async function initiateScrollingCapture() {
  showNotification('準備開始滾動截圖...', 'info');
  await sleep(1000);

  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  window.scrollTo(0, 0);
  await sleep(500); // 等待滾動生效

  const pageHeight = document.body.scrollHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const captures = [];

  try {
    for (let y = 0; y < pageHeight; y += viewportHeight) {
      window.scrollTo(0, y);
      await sleep(800); // 等待頁面渲染 (特別是懶加載圖片)

      showNotification(`正在截取 ${Math.round((y / pageHeight) * 100)}%...`, 'info');

      const response = await chrome.runtime.sendMessage({ action: 'captureTab' });
      if (response.success) {
        captures.push(response.imageData);
      } else {
        throw new Error(response.error || '截圖失敗');
      }
    }

    showNotification('正在拼接圖片...', 'info');
    const stitchedImage = await stitchImages(captures, viewportWidth, pageHeight);

    // 檢查圖片大小是否超過限制 (32MB)
    const imageSize = stitchedImage.length * 0.75;
    const limit = 32 * 1024 * 1024;
    if (imageSize > limit) {
      const sizeInMB = (imageSize / 1024 / 1024).toFixed(2);
      showNotification(`錯誤：圖片大小 (${sizeInMB}MB) 超過 32MB 限制，無法上傳。`, 'error', 8000);
      // 恢復原始滾動位置
      window.scrollTo(originalScrollX, originalScrollY);
      return;
    }

    showFilenamePrompt(stitchedImage);

  } catch (error) {
    console.error('滾動截圖失敗:', error);
    showNotification('滾動截圖失敗: ' + error.message, 'error');
  } finally {
    // 恢復原始滾動位置
    window.scrollTo(originalScrollX, originalScrollY);
  }
}
