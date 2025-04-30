const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { admin, db, auth } = require('../config/firebase');
const { 
  getDocById, 
  createDoc, 
  updateDoc, 
  deleteDoc, 
  queryDocs, 
  getAllDocs 
} = require('../utils/firestoreUtils');

// 用戶集合名稱
const COLLECTION = 'users';

// @desc    認證用戶 & 獲取 token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 通過郵箱查詢用戶
    const users = await queryDocs(COLLECTION, 'email', '==', email);
    
    if (users.length === 0) {
      res.status(401);
      throw new Error('信箱或密碼不正確');
    }
    
    const user = users[0];
    
    // 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('信箱或密碼不正確');
    }
  } catch (error) {
    res.status(500);
    throw new Error('用戶認證失敗: ' + error.message);
  }
};

// @desc    註冊新用戶
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 檢查郵箱是否已被使用
    const users = await queryDocs(COLLECTION, 'email', '==', email);
    
    if (users.length > 0) {
      res.status(400);
      throw new Error('用戶已存在');
    }
    
    // 加密密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 創建用戶文檔
    const userData = {
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    };
    
    const user = await createDoc(COLLECTION, userData);
    
    if (user) {
      // 使用 Firebase Auth 創建用戶（可選）
      // 這裡我們僅使用 Firestore，但在實際應用中您可能也想創建對應的 Auth 用戶
      // try {
      //   await auth.createUser({
      //     uid: user.id,
      //     email,
      //     password,
      //     displayName: name
      //   });
      // } catch (authError) {
      //   console.error('創建 Firebase Auth 用戶失敗:', authError);
      // }
      
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('無效的用戶資料');
    }
  } catch (error) {
    res.status(500);
    throw new Error('用戶註冊失敗: ' + error.message);
  }
};

// @desc    獲取用戶資料
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await getDocById(COLLECTION, req.user.id);

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('用戶未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('獲取用戶資料失敗: ' + error.message);
  }
};

// @desc    更新用戶資料
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await getDocById(COLLECTION, req.user.id);

    if (user) {
      // 準備更新數據
      const updateData = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
      };
      
      // 如果提供了新密碼，則加密更新
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }
      
      const updatedUser = await updateDoc(COLLECTION, req.user.id, updateData);
      
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404);
      throw new Error('用戶未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('更新用戶資料失敗: ' + error.message);
  }
};

// @desc    獲取所有用戶
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await getAllDocs(COLLECTION);
    res.json(users);
  } catch (error) {
    res.status(500);
    throw new Error('獲取用戶列表失敗: ' + error.message);
  }
};

// @desc    刪除用戶
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await getDocById(COLLECTION, req.params.id);

    if (user) {
      await deleteDoc(COLLECTION, req.params.id);
      
      // 刪除對應的 Auth 用戶（如果有）
      // try {
      //   await auth.deleteUser(req.params.id);
      // } catch (authError) {
      //   console.error('刪除 Firebase Auth 用戶失敗:', authError);
      // }
      
      res.json({ message: '用戶已刪除' });
    } else {
      res.status(404);
      throw new Error('用戶未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('刪除用戶失敗: ' + error.message);
  }
};

// @desc    通過 ID 獲取用戶
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await getDocById(COLLECTION, req.params.id);
    
    if (user) {
      // 不返回密碼
      const { password, ...userData } = user;
      res.json(userData);
    } else {
      res.status(404);
      throw new Error('用戶未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('獲取用戶失敗: ' + error.message);
  }
};

// @desc    更新用戶
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await getDocById(COLLECTION, req.params.id);

    if (user) {
      const updateData = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        isAdmin: req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin,
      };
      
      const updatedUser = await updateDoc(COLLECTION, req.params.id, updateData);
      
      // 不返回密碼
      const { password, ...userData } = updatedUser;
      res.json(userData);
    } else {
      res.status(404);
      throw new Error('用戶未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('更新用戶失敗: ' + error.message);
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
