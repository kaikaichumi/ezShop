const jwt = require('jsonwebtoken');
const { getDocById } = require('../utils/firestoreUtils');

// 保護路由 - 需要登入
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 從 Firestore 獲取用戶
      const user = await getDocById('users', decoded.id);
      
      if (!user) {
        res.status(401);
        throw new Error('未授權，用戶不存在');
      }
      
      // 不包括密碼
      const { password, ...userData } = user;
      req.user = userData;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('未授權，token失敗');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('未授權，沒有token');
  }
};

// 管理員中間件
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('未授權，只有管理員可以訪問');
  }
};

module.exports = { protect, admin };
