import { uploadToImgBB } from './api.js';
import { copyToClipboard } from './utils.js';

export function showInstruction(message) {
  const instructionText = document.getElementById('screenshot-instruction');
  if (instructionText) {
    instructionText.textContent = message;
  }
}

export function showNotification(message, type = 'info', duration = 3000) {
  console.log('顯示通知:', message, type); // 添加調試日志

  // 移除現有通知
  const existingNotification = document.getElementById('screenshot-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'screenshot-notification';
  notification.className = `screenshot-notification screenshot-notification-${type}`;
  notification.textContent = message;

  // 確保通知有正確的樣式
  notification.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    padding: 12px 20px !important;
    border-radius: 4px !important;
    color: white !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    z-index: 2147483649 !important;
    max-width: 300px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    pointer-events: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'} !important;
  `;

  document.body.appendChild(notification);
  console.log('通知已添加到DOM:', notification); // 添加調試日志

  // 自動移除
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
      console.log('通知已移除'); // 添加調試日志
    }
  }, duration);
}

export function showFilenamePrompt(imageData) {
  // 移除舊的提示窗
  const existingPrompt = document.getElementById('filename-prompt-overlay');
  if (existingPrompt) {
    existingPrompt.remove();
  }

  // 創建覆蓋層
  const overlay = document.createElement('div');
  overlay.id = 'filename-prompt-overlay';
  overlay.className = 'filename-prompt-overlay';

  // 創建 modal
  const modal = document.createElement('div');
  modal.className = 'filename-prompt-modal';

  // 標題
  const title = document.createElement('h3');
  title.textContent = '為您的截圖命名';
  modal.appendChild(title);

  // 輸入框
  const input = document.createElement('input');
  input.type = 'text';
  const defaultName = `screenshot-${new Date().toISOString().slice(0, 19).replace('T', '-')}`;
  input.placeholder = `(可選) 預設: ${defaultName}`;
  modal.appendChild(input);

  // 按鈕容器
  const buttons = document.createElement('div');
  buttons.className = 'filename-prompt-buttons';

  // 取消按鈕
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.className = 'filename-prompt-cancel';
  buttons.appendChild(cancelBtn);

  // 確認按鈕
  const okBtn = document.createElement('button');
  okBtn.textContent = '確認並上傳';
  okBtn.className = 'filename-prompt-ok';
  buttons.appendChild(okBtn);

  modal.appendChild(buttons);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  input.focus();

  const handleConfirm = async () => {
    const filename = input.value.trim() || defaultName;
    overlay.remove();
    showNotification('正在上傳到imgBB...', 'info');

    try {
      const url = await uploadToImgBB(imageData, filename);
      await copyToClipboard(url);
      showNotification(`截圖已上傳！網址 (已複製): ${url}`, 'success', 6000);
      console.log('圖片URL:', url);
    } catch (error) {
      console.error('上傳失敗:', error);
      showNotification('上傳失敗: ' + error.message, 'error');
    }
  };

  const handleCancel = () => {
    overlay.remove();
    showNotification('操作已取消', 'info');
  };

  okBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  });
}
