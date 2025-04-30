const { 
  getAllDocs, 
  getDocById, 
  createDoc, 
  updateDoc, 
  deleteDoc,
  queryDocs,
  getDocsPaginated
} = require('../utils/firestoreUtils');

// 產品集合名稱
const COLLECTION = 'products';

// @desc    獲取所有產品
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // 實現搜索功能
    let products = [];
    let count = 0;
    
    if (req.query.keyword) {
      const keyword = req.query.keyword.toLowerCase();
      // 由於 Firestore 不支持模糊搜索，我們需要先獲取所有產品，然後在內存中過濾
      const allProducts = await getAllDocs(COLLECTION);
      products = allProducts.filter(product => 
        product.name && product.name.toLowerCase().includes(keyword)
      );
      count = products.length;
      
      // 手動分頁
      products = products.slice((page - 1) * pageSize, page * pageSize);
    } else {
      // 使用分頁獲取產品
      try {
        const result = await getDocsPaginated(COLLECTION, pageSize);
        products = result.docs || [];
        
        // 獲取總數（注意：這可能會對大型集合產生性能影響）
        const allProducts = await getAllDocs(COLLECTION);
        count = allProducts.length;
      } catch (err) {
        console.log('獲取產品分頁失敗，返回空列表', err);
        // 如果有錯誤，至少返回一個空列表
        products = [];
        count = 0;
      }
    }
    
    // 確保每個產品都有 _id 欄位
    products = products.map(product => {
      if (product.id && !product._id) {
        return { ...product, _id: product.id };
      }
      return product;
    });
    
    console.log('返回產品列表，數量:', products.length);
    if (products.length > 0) {
      console.log('第一個產品ID:', products[0].id, '_id:', products[0]._id);
    }
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize) || 1 // 確保至少有一頁
    });
  } catch (error) {
    console.error('獲取產品失敗:', error);
    // 即使出錯也返回空列表，而不是直接拋出錯誤
    res.json({
      products: [],
      page: 1,
      pages: 1
    });
  }
};

// @desc    獲取單個產品
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // 檢查 id 是否為 undefined 或無效
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: '無效的產品ID' });
    }
    
    const product = await getDocById(COLLECTION, req.params.id);
    
    if (product) {
      // 確保返回的對象中有 _id 欄位 (前端期望的 ID 欄位名稱)
      if (product.id) {
        product._id = product.id;
      }
      res.json(product);
    } else {
      // 將 404 錯誤直接返回給客戶端，而不是拋出錯誤
      return res.status(404).json({ message: '產品未找到' });
    }
  } catch (error) {
    console.error('獲取產品詳情失敗:', error);
    res.status(500).json({ 
      message: '獲取產品失敗', 
      error: error.message
    });
  }
};

// @desc    刪除產品
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    // 檢查 id 是否為 undefined 或無效
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: '無效的產品ID' });
    }
    
    // 確保 ID 是字符串形式
    const productId = String(req.params.id);
    console.log('嘗試刪除產品，ID:', productId, '類型:', typeof productId);
    
    const product = await getDocById(COLLECTION, productId);
    
    if (product) {
      await deleteDoc(COLLECTION, productId);
      console.log('產品刪除成功，ID:', productId);
      res.json({ message: '產品已刪除', success: true });
    } else {
      console.error('產品未找到，ID:', productId);
      res.status(404).json({ message: '產品未找到' });
    }
  } catch (error) {
    console.error('刪除產品失敗:', error);
    res.status(500).json({ message: '刪除產品失敗: ' + error.message });
  }
};

// @desc    創建產品
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = {
      name: '產品名稱',
      price: 0,
      user: req.user.id, // 使用 Firestore ID
      image: '/images/sample.jpg',
      brand: '品牌',
      category: '分類',
      countInStock: 0,
      numReviews: 0,
      description: '產品描述',
      rating: 0,
      reviews: []
    };
    
    const createdProduct = await createDoc(COLLECTION, productData);
    
    // 確保返回的對象中有 _id 欄位 (前端期望的 ID 欄位名稱)
    if (createdProduct && createdProduct.id) {
      createdProduct._id = createdProduct.id;
      console.log('創建產品成功，ID:', createdProduct._id);
    }
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('創建產品失敗:', error);
    res.status(500).json({ message: '創建產品失敗: ' + error.message });
  }
};

// @desc    更新產品
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    // 檢查 id 是否為 undefined 或無效
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: '無效的產品ID' });
    }
    
    // 確保 ID 是字符串形式
    const productId = String(req.params.id);
    console.log('嘗試更新產品:')
    console.log('- ID:', productId, '類型:', typeof productId); 
    console.log('- 提供的數據:', req.body);
    
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const product = await getDocById(COLLECTION, productId);

    if (product) {
      console.log('產品找到，原始產品:', product);
      
      const updatedData = {
        name: name || product.name,
        price: price !== undefined ? price : product.price,
        description: description || product.description,
        image: image || product.image,
        brand: brand || product.brand,
        category: category || product.category,
        countInStock: countInStock !== undefined ? countInStock : product.countInStock
      };
      
      console.log('更新數據:', updatedData);
      const updatedProduct = await updateDoc(COLLECTION, productId, updatedData);
      
      // 確保返回的產品有 _id 欄位
      if (updatedProduct && updatedProduct.id) {
        updatedProduct._id = updatedProduct.id;
      }
      
      console.log('產品更新成功:', updatedProduct);
      res.json(updatedProduct);
    } else {
      console.error('產品未找到，ID:', productId);
      res.status(404).json({ message: '產品未找到' });
    }
  } catch (error) {
    console.error('更新產品失敗:', error);
    res.status(500).json({ message: '更新產品失敗: ' + error.message });
  }
};

// @desc    創建新評論
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await getDocById(COLLECTION, req.params.id);

    if (product) {
      // 確保 reviews 數組存在
      const reviews = product.reviews || [];
      
      // 檢查用戶是否已經評論過
      const alreadyReviewed = reviews.find(
        r => r.user && r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: '產品已評論' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user.id,
        createdAt: new Date().toISOString()
      };

      // 添加新評論
      reviews.push(review);
      
      // 計算新的評分
      const newRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      
      const updatedData = {
        reviews,
        rating: newRating,
        numReviews: reviews.length
      };
      
      await updateDoc(COLLECTION, req.params.id, updatedData);
      res.status(201).json({ message: '評論已添加' });
    } else {
      res.status(404).json({ message: '產品未找到' });
    }
  } catch (error) {
    console.error('添加評論失敗:', error);
    res.status(500).json({ message: '添加評論失敗: ' + error.message });
  }
};

// @desc    獲取評分最高的產品
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    // 獲取所有產品
    const allProducts = await getAllDocs(COLLECTION);
    
    // 排序並限制數量
    const products = allProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
    
    res.json(products);
  } catch (error) {
    console.error('獲取熱門產品失敗:', error);
    // 即使出錯也返回空列表
    res.json([]);
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
