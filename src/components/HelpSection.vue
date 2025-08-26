<template>
  <div class="help-section">
    <details class="help-details">
      <summary class="help-summary">任意截圖使用說明</summary>
      <div class="help-content">
        <ol class="help-list">
          <li>點擊「任意截圖」或按 <kbd>{{ isMac ? 'Cmd+Shift+S' : 'Ctrl+Shift+S' }}</kbd></li>
          <li>在網頁上拖拽選擇要截圖的區域</li>
          <li>釋放滑鼠完成選擇</li>
          <li>圖片將自動上傳到imgBB並複製網址到剪貼簿</li>
          <li>按 <kbd>ESC</kbd> 可以取消截圖</li>
        </ol>
      </div>
    </details>
  </div>
</template>

<script setup>
defineProps({
  isMac: Boolean,
});
</script>
