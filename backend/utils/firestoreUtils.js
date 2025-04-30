const { db, isUsingMock } = require('../config/firebase');

// 生成隨機ID (用於模擬環境)
const generateId = () => {
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

// 獲取集合中的所有文檔
const getAllDocs = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();
    
    // 不同的處理方式基於真實或模擬數據庫
    if (isUsingMock) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id, // 添加 _id 字段兼容前端
        ...doc.data()
      }));
    } else {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id, // 添加 _id 字段兼容前端
        ...doc.data()
      }));
    }
  } catch (error) {
    console.error(`獲取${collection}集合文檔失敗:`, error);
    throw error;
  }
};

// 根據ID獲取文檔
const getDocById = async (collection, id) => {
  try {
    console.log(`嘗試根據ID獲取文檔, 集合: ${collection}, ID: ${id}, 類型: ${typeof id}`);
    
    if (!id) {
      console.error('ID為空，無法獲取文檔');
      return null;
    }
    
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      console.log(`文檔不存在, 集合: ${collection}, ID: ${id}`);
      return null;
    }
    
    // 返回數據時包含id和_id
    return {
      id: doc.id,
      _id: doc.id, // 添加 _id 字段兼容前端
      ...doc.data()
    };
  } catch (error) {
    console.error(`獲取${collection}集合中ID為${id}的文檔失敗:`, error);
    throw error;
  }
};

// 創建文檔
const createDoc = async (collection, data) => {
  try {
    console.log(`嘗試創建文檔, 集合: ${collection}`);
    
    // 添加時間戳
    const docData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let docRef;
    
    if (isUsingMock) {
      // 模擬環境下添加一個隨機ID
      const id = generateId();
      docRef = db.collection(collection).doc(id);
      await docRef.set(docData);
      console.log(`模擬環境創建文檔成功, ID: ${id}`);
    } else {
      // 真實 Firestore
      docRef = await db.collection(collection).add(docData);
      console.log(`真實環境創建文檔成功, ID: ${docRef.id}`);
    }
    
    // 獲取新創建的文檔
    const newDoc = await docRef.get();
    
    const result = {
      id: newDoc.id,
      _id: newDoc.id, // 添加 _id 字段兼容前端
      ...newDoc.data()
    };
    
    console.log(`完成文檔創建, ID: ${result.id}, _id: ${result._id}`);
    return result;
  } catch (error) {
    console.error(`創建${collection}集合文檔失敗:`, error);
    throw error;
  }
};

// 更新文檔
const updateDoc = async (collection, id, data) => {
  try {
    console.log(`嘗試更新文檔, 集合: ${collection}, ID: ${id}, 類型: ${typeof id}`);
    
    if (!id) {
      throw new Error(`無法更新文檔: ID不存在`);
    }
    
    // 先檢查文檔是否存在
    const docRef = db.collection(collection).doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      console.error(`無法更新${collection}中的文檔: ID為${id}的文檔不存在`);
      throw new Error(`無法更新: 文檔不存在`);
    }
    
    // 添加更新時間戳
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // 執行更新
    await docRef.update(updateData);
    console.log(`文檔更新成功, 集合: ${collection}, ID: ${id}`);
    
    // 獲取更新後的文檔
    const updatedDoc = await getDocById(collection, id);
    console.log(`返回更新後的文檔, ID: ${updatedDoc.id}, _id: ${updatedDoc._id}`);
    return updatedDoc;
  } catch (error) {
    console.error(`更新${collection}集合中ID為${id}的文檔失敗:`, error);
    throw error;
  }
};

// 刪除文檔
const deleteDoc = async (collection, id) => {
  try {
    console.log(`嘗試刪除文檔, 集合: ${collection}, ID: ${id}, 類型: ${typeof id}`);
    
    // 檢查ID是否存在
    if (!id) {
      throw new Error(`無法刪除文檔: ID不存在`);
    }
    
    // 先獲取文檔以確認存在
    const docRef = db.collection(collection).doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      console.error(`無法刪除${collection}中的文檔: ID為${id}的文檔不存在`);
      throw new Error(`無法刪除: 文檔不存在`);
    }
    
    // 執行刪除
    await docRef.delete();
    console.log(`文檔刪除成功, 集合: ${collection}, ID: ${id}`);
    return { success: true };
  } catch (error) {
    console.error(`刪除${collection}集合中ID為${id}的文檔失敗:`, error);
    throw error;
  }
};

// 使用條件查詢文檔
const queryDocs = async (collection, field, operator, value) => {
  try {
    console.log(`嘗試查詢文檔, 集合: ${collection}, 字段: ${field}, 操作符: ${operator}, 值: ${value}`);
    
    let result = [];
    
    if (isUsingMock) {
      // 模擬環境下的簡單過濾
      const allDocs = await getAllDocs(collection);
      result = allDocs.filter(doc => {
        if (operator === '==') return doc[field] === value;
        if (operator === '!=') return doc[field] !== value;
        if (operator === '>') return doc[field] > value;
        if (operator === '>=') return doc[field] >= value;
        if (operator === '<') return doc[field] < value;
        if (operator === '<=') return doc[field] <= value;
        return false;
      });
    } else {
      const snapshot = await db.collection(collection)
        .where(field, operator, value)
        .get();
        
      result = snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id, // 添加 _id 字段兼容前端
        ...doc.data()
      }));
    }
    
    console.log(`查詢結果數量: ${result.length}`);
    return result;
  } catch (error) {
    console.error(`查詢${collection}集合文檔失敗:`, error);
    throw error;
  }
};

// 分頁獲取文檔
const getDocsPaginated = async (collection, limit = 10, startAfter = null) => {
  try {
    console.log(`嘗試分頁獲取文檔, 集合: ${collection}, 每頁數量: ${limit}, 起始ID: ${startAfter || '無'}`);
    
    let docs = [];
    let hasMore = false;
    let lastVisible = null;
    
    if (isUsingMock) {
      // 模擬環境下的簡單分頁
      const allDocs = await getAllDocs(collection);
      const sortedDocs = allDocs.sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      
      let startIndex = 0;
      if (startAfter) {
        startIndex = sortedDocs.findIndex(doc => doc.id === startAfter);
        if (startIndex !== -1) {
          startIndex += 1;
        }
      }
      
      docs = sortedDocs.slice(startIndex, startIndex + limit);
      hasMore = sortedDocs.length > startIndex + limit;
      lastVisible = hasMore ? docs[docs.length - 1].id : null;
    } else {
      let query = db.collection(collection)
        .orderBy('createdAt', 'desc')
        .limit(limit);
      
      if (startAfter) {
        const startDoc = await db.collection(collection).doc(startAfter).get();
        if (startDoc.exists) {
          query = query.startAfter(startDoc);
        }
      }
      
      const snapshot = await query.get();
      
      docs = snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id, // 添加 _id 字段兼容前端
        ...doc.data()
      }));
      
      // 檢查是否有更多數據
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      hasMore = snapshot.docs.length === limit;
      lastVisible = hasMore && lastDoc ? lastDoc.id : null;
    }
    
    console.log(`獲取到的文檔數量: ${docs.length}, 是否有更多: ${hasMore}`);
    return {
      docs,
      lastVisible,
      hasMore
    };
  } catch (error) {
    console.error(`分頁獲取${collection}集合文檔失敗:`, error);
    throw error;
  }
};

module.exports = {
  getAllDocs,
  getDocById,
  createDoc,
  updateDoc,
  deleteDoc,
  queryDocs,
  getDocsPaginated
};
