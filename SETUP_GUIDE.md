# ezShop 設置指南

本指南將協助您設置和運行 ezShop 電商平台，包括 Firebase Firestore 的配置步驟。

## 設置 Firebase

1. **創建 Firebase 帳戶和項目**
   - 訪問 [Firebase 控制台](https://console.firebase.google.com/)
   - 點擊「添加項目」並輸入您的項目名稱（例如 "ezshop"）
   - 按照引導完成項目創建

2. **設置 Firestore 數據庫**
   - 在左側導航欄選擇「Firestore Database」
   - 點擊「創建數據庫」
   - 選擇「測試模式」（開發用途）或「生產模式」（生產用途）
   - 選擇數據庫位置（建議選擇靠近您的用戶的位置）

3. **獲取 Firebase 服務帳戶密鑰**
   - 點擊左上角的「專案設定」（齒輪圖標）
   - 切換到「服務帳戶」標籤頁
   - 點擊「產生新的私密金鑰」按鈕
   - 下載生成的 JSON 文件
   - **注意**：保管好這個文件，它包含了敏感信息！

4. **配置 Firebase 認證**
   - 打開 `backend/config/firebase.js` 文件
   - 使用下載的 JSON 文件內容更新 `serviceAccount` 變數
   - 或者（更安全的做法）將 JSON 文件內容轉換為字符串，並保存在 `.env` 文件的 `FIREBASE_SERVICE_ACCOUNT` 變數中

## 設置後端

1. **安裝依賴**
   ```bash
   cd backend
   npm install
   ```

2. **配置環境變數**
   - 將 `.env` 文件中的 `JWT_SECRET` 更改為一個安全的隨機字符串
   - 如果您使用環境變數方式保存 Firebase 憑證，請相應添加

3. **運行開發服務器**
   ```bash
   npm run dev
   ```

## 設置前端

1. **安裝依賴**
   ```bash
   cd frontend
   npm install
   ```

2. **運行開發服務器**
   ```bash
   npm run dev
   ```

## 初始化管理員帳戶

由於系統需要管理員帳戶來管理產品和用戶，您需要創建一個管理員用戶：

1. **註冊一個普通用戶**
   - 打開瀏覽器訪問 http://localhost:3000
   - 點擊「註冊」並創建一個新帳戶

2. **將用戶升級為管理員**
   - 在 Firebase 控制台中打開您的 Firestore 數據庫
   - 找到「users」集合
   - 找到您剛剛創建的用戶文檔
   - 編輯「isAdmin」字段，將其值改為 `true`
   - 保存更改

## 測試系統

現在您應該可以使用管理員帳戶登入系統，並使用所有功能了：

1. **添加產品**
   - 使用管理員帳戶登入
   - 訪問「產品管理」頁面
   - 點擊「新增產品」按鈕
   - 填寫產品詳情並保存

2. **測試訂單流程**
   - 註冊一個普通用戶帳戶
   - 瀏覽產品並添加到購物車
   - 完成結帳過程
   - 使用管理員帳戶查看訂單管理頁面

## 部署指南

當您準備將應用部署到生產環境時，請考慮以下選項：

### 前端部署
- **Firebase Hosting**：最簡單的選擇，與您的 Firestore 數據庫在同一平台
- **Vercel/Netlify**：提供免費和付費計劃，易於設置
- **雲服務提供商**：如 GCP、AWS、Azure 等

### 後端部署
- **Cloud Functions for Firebase**：如果您希望保持在 Firebase 生態系統中
- **Cloud Run (GCP)**：適合需要更多控制的情況
- **App Engine (GCP)**：適合需要高可擴展性的應用
- **其他雲服務提供商**：AWS、Azure、Heroku 等

### 重要安全提示
- 生產環境請始終使用環境變數來存儲敏感信息
- 配置適當的 Firestore 安全規則來保護您的數據
- 考慮啟用更多 Firebase 服務，如 Authentication、Storage 等來增強功能

## 資源
- [Firebase 文檔](https://firebase.google.com/docs)
- [Vue.js 文檔](https://vuejs.org/guide/introduction.html)
- [Express.js 文檔](https://expressjs.com/)

如果您在設置過程中遇到任何問題，請參考相關文檔或尋求社區支持。