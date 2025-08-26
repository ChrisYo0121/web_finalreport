# 秒截 - 瀏覽器截圖擴充功能

這是一個使用 Vue 3 和 Vite 開發的瀏覽器擴充功能，旨在提供強大的網頁截圖與互動體驗。

## ✨ 功能特色

*   **彈出式介面 (Popup)**：提供一個乾淨、易於操作的主控台，使用 Vue 3 建構。
*   **內容腳本 (Content Script)**：能直接與網頁 DOM 互動，實現頁面標記、選取等功能。
*   **背景服務 (Background Service)**：處理需要長時間運行的任務，例如圖片捕獲、資料儲存等。
*   **多種截圖模式**：
    *   可視範圍截圖
    *   全頁滾動截圖
    *   指定區域截圖 (剪刀功能)
*   **狀態顯示**：在介面中清晰地顯示當前操作狀態。
*   **設定與幫助**：提供設定選項與使用說明，提升使用者體驗。

## 🚀 技術棧

*   **框架**: [Vue 3](https://vuejs.org/)
*   **建置工具**: [Vite](https://vitejs.dev/)
*   **語言**: JavaScript, HTML, CSS
*   **平台**: 瀏覽器擴充功能 (Chrome, Firefox, etc.)

## 📂 專案結構

本專案的目錄結構清晰，各模組職責分明：

```
/
├── public/               # 靜態資源，如 manifest.json 和圖示
├── src/                  # 主要原始碼目錄
│   ├── App.vue           # Vue 彈出視窗的主組件
│   ├── main.js           # Vue 應用的進入點
│   ├── popup.html        # 擴充功能的彈出頁面
│   ├── popup.css         # 彈出頁面的樣式
│   ├── background.js     # 背景服務腳本
│   ├── content-script.js # 注入到網頁的內容腳本
│   ├── content-script.css# 內容腳本的樣式
│   │
│   ├── background/       # 背景腳本的模組化代碼
│   │   ├── capture.js    # 處理螢幕捕獲邏輯
│   │   ├── scripting.js  # 管理腳本注入
│   │   └── storage.js    # 處理瀏覽器儲存
│   │
│   ├── components/       # Vue 的可複用組件
│   │   ├── ActionButtons.vue # 操作按鈕
│   │   ├── Header.vue      # 頁首
│   │   ├── Footer.vue      # 頁尾
│   │   └── ...             # 其他 UI 組件
│   │
│   └── content/          # 內容腳本的模組化代碼
│       ├── api.js        # 與背景腳本的通訊
│       ├── image.js      # 圖片處理
│       ├── scrolling.js  # 滾動截圖邏輯
│       ├── selection.js  # 處理使用者選取
│       ├── ui.js         # 在頁面上生成 UI
│       └── utils.js      # 工具函數
│
├── package.json          # 專案依賴與腳本
└── vite.config.js        # Vite 設定檔
```

## ⚙️ 安裝與設定

1.  **複製專案**
    ```bash
    git clone <your-repository-url>
    cd web_finalreport
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

## 🛠️ 開發

1.  **啟動開發模式**

    此命令會啟動 Vite 的建置程序，並在檔案變更時自動重新編譯。
    ```bash
    npm run watch
    ```
    這會在根目錄下生成一個 `dist` 資料夾。

2.  **載入擴充功能到瀏覽器**

    *   **Chrome/Edge**:
        1.  開啟瀏覽器，前往 `chrome://extensions`
        2.  啟用右上角的「開發人員模式」。
        3.  點擊「載入未封裝的擴充功能」。
        4.  選擇專案根目錄下的 `dist` 資料夾。

    *   **Firefox**:
        1.  開啟瀏覽器，前往 `about:debugging`
        2.  點擊「此 Firefox」。
        3.  點擊「載入臨時附加元件」。
        4.  選擇 `dist/manifest.json` 檔案。

## 📦 建置

執行以下命令來建置生產版本的擴充功能：

```bash
npm run build
```
這會生成優化過的 `dist` 資料夾，可用於發布到擴充功能商店。

## 📜 可用腳本

在 `package.json` 中定義了以下腳本：

*   `npm run dev`: 啟動 Vite 開發伺服器 (主要用於網頁開發，對於擴充功能開發較少用)。
*   `npm run build`: 為生產環境建置擴充功能。
*   `npm run watch`: 監控檔案變更並自動建置，適合擴充功能開發。

---
*此 README.md 由 Gemini 自動生成。*
