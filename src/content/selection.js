import { showInstruction, showNotification, showFilenamePrompt } from './ui.js';
import { cropImage } from './image.js';

let isSelecting = false;
let selectionOverlay = null;
let selectionBox = null;
let instructionText = null;
let startX, startY, endX, endY;
let isMouseDown = false;

function createSelectionOverlay() {
  console.log('創建選擇覆蓋層');

  // 先清理可能存在的舊覆蓋層
  const existingOverlay = document.getElementById('screenshot-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // 創建全屏覆蓋層
  selectionOverlay = document.createElement('div');
  selectionOverlay.id = 'screenshot-overlay';
  selectionOverlay.className = 'screenshot-overlay';


  // 創建選取框
  selectionBox = document.createElement('div');
  selectionBox.id = 'screenshot-selection-box';
  selectionBox.className = 'screenshot-selection-box';

  // 創建指示文字
  instructionText = document.createElement('div');
  instructionText.id = 'screenshot-instruction';
  instructionText.className = 'screenshot-instruction';
  instructionText.textContent = '拖拽選擇截圖區域';

  selectionOverlay.appendChild(selectionBox);
  selectionOverlay.appendChild(instructionText);

  // 確保添加到body的最後
  document.body.appendChild(selectionOverlay);

  console.log('覆蓋層已添加到DOM，元素數量:', selectionOverlay.children.length);

  // 添加事件監聽器
  selectionOverlay.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseup', onMouseUp, true);
  document.addEventListener('keydown', onKeyDown, true);

  // 防止页面滚动
  document.body.style.overflow = 'hidden';
}

function onMouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  isMouseDown = true;

  // 使用視口(client)座標，與 fixed 覆蓋層對齊
  startX = e.clientX;
  startY = e.clientY;

  // 顯示選取框並設置初始位置
  // selectionBox.style.display = 'block';
  selectionBox.style.setProperty('display', 'block', 'important');
  selectionBox.style.left = startX + 'px';
  selectionBox.style.top = startY + 'px';
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';

  showInstruction('拖拽選擇區域，釋放滑鼠完成');
}

function onMouseMove(e) {
  if (!isMouseDown || !selectionBox || selectionBox.style.display === 'none') return;

  e.preventDefault();
  e.stopPropagation();

  // 使用視口(client)座標
  endX = e.clientX;
  endY = e.clientY;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  // 更新選取框位置和大小（相對覆蓋層）
  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';

  if (width > 0 && height > 0) {
    showInstruction(`選擇區域: ${Math.round(width)} × ${Math.round(height)} 像素`);
  }
}

function onMouseUp(e) {
  if (!isMouseDown) return;

  e.preventDefault();
  e.stopPropagation();

  isMouseDown = false;

  // 使用視口(client)座標
  endX = e.clientX;
  endY = e.clientY;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  if (width > 10 && height > 10) {
    showInstruction(`已選擇 ${Math.round(width)} × ${Math.round(height)} 像素 - 正在處理...`);

    // 直接傳入視口座標進行截圖裁剪
    captureSelectedArea(left, top, width, height);
  } else {
    showNotification('選擇區域太小，請重新選擇', 'warning');
    cleanupSelection();
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    cleanupSelection();
    showNotification('截圖已取消', 'info');
  }
}

export function cleanupSelection() {
  isSelecting = false;
  isMouseDown = false;
  document.body.style.userSelect = '';
  document.body.style.overflow = '';

  if (selectionOverlay) {
    selectionOverlay.remove();
    selectionOverlay = null;
    selectionBox = null;
    instructionText = null;
  }

  // 移除事件监听器
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('mouseup', onMouseUp, true);
  document.removeEventListener('keydown', onKeyDown, true);

  // 再次確保所有相關元素都被清除
  const remainingOverlay = document.getElementById('screenshot-overlay');
  if (remainingOverlay) {
    remainingOverlay.remove();
  }

  const remainingInstruction = document.getElementById('screenshot-instruction');
  if (remainingInstruction) {
    remainingInstruction.remove();
  }

  // 重置變數
  selectionOverlay = null;
  selectionBox = null;
  instructionText = null;
}

async function captureSelectedArea(left, top, width, height) {
  try {
    // 完全移除所有覆蓋元素
    if (selectionOverlay) {
      selectionOverlay.remove();
      selectionOverlay = null;
      selectionBox = null;
      instructionText = null;
    }

    // 暫時移除通知，避免影響截圖
    const existingNotification = document.getElementById('screenshot-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // 恢復頁面狀態
    document.body.style.userSelect = '';
    document.body.style.overflow = '';

    // 等待DOM完全更新
    await new Promise(resolve => setTimeout(resolve, 300));

    // 請求背景腳本截取標籤頁
    const response = await chrome.runtime.sendMessage({
      action: 'captureTab'
    });

    if (!response.success) {
      throw new Error(response.error || '截圖失敗');
    }

    // 裁剪選擇的區域
    const croppedImage = await cropImage(response.imageData, left, top, width, height);

    // 顯示檔名輸入視窗
    showFilenamePrompt(croppedImage);

  } catch (error) {
    console.error('截圖處理失敗:', error);
    showNotification('操作失敗: ' + error.message, 'error');
  } finally {
    // 確保完全清理狀態
    isSelecting = false;
    isMouseDown = false;

    // 移除事件监听器
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('mouseup', onMouseUp, true);
    document.removeEventListener('keydown', onKeyDown, true);

    // 再次確保所有相關元素都被清除
    const remainingOverlay = document.getElementById('screenshot-overlay');
    if (remainingOverlay) {
      remainingOverlay.remove();
    }

    const remainingInstruction = document.getElementById('screenshot-instruction');
    if (remainingInstruction) {
      remainingInstruction.remove();
    }

    // 重置變數
    selectionOverlay = null;
    selectionBox = null;
    instructionText = null;
  }
}

export function startScreenshotSelection() {
  if (isSelecting) {
    console.log('已經在選擇模式中，忽略重複請求');
    return;
  }

  console.log('開始截圖選擇模式');
  isSelecting = true;
  createSelectionOverlay();
  document.body.style.userSelect = 'none';
  showInstruction('拖拽選擇截圖區域，按ESC取消');
}
