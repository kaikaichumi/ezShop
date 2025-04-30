const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;
let db;
let auth;

try {
  // 從環境變數獲取服務帳戶密鑰
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('找到 Firebase 服務帳戶密鑰，初始化...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    // 初始化 Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    auth = admin.auth();
    
    console.log('Firebase 初始化成功 - 使用真實的 Firestore');
  } else {
    throw new Error('未找到 Firebase 服務帳戶密鑰，請檢查環境變數');
  }
} catch (error) {
  console.error('Firebase 初始化失敗:', error);
  throw error; // 如果是真實環境，我們希望服務器在無法連接到 Firebase 時直接停止啟動
}

module.exports = {
  admin,
  db,
  auth
};
