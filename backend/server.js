const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// 載入環境變數
dotenv.config();

// 載入 Firebase
require('./config/firebase');

// 初始化Express應用
const app = express();

// 中間件
// 在 server.js 中更新
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 測試路由
app.get('/api', (req, res) => {
  res.json({ message: '歡迎使用ezShop API' });
});

// 載入路由
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 設定靜態資料夾
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 錯誤處理中間件
app.use(notFound);
app.use(errorHandler);

// 啟動伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
