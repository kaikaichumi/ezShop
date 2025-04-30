const { 
  getDocById, 
  createDoc, 
  updateDoc, 
  queryDocs, 
  getAllDocs 
} = require('../utils/firestoreUtils');

// 訂單集合名稱
const COLLECTION = 'orders';

// @desc    創建新訂單
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('沒有訂單項目');
    } else {
      // 準備訂單數據
      const orderData = {
        orderItems,
        user: req.user.id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false,
      };

      const createdOrder = await createDoc(COLLECTION, orderData);
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500);
    throw new Error('創建訂單失敗: ' + error.message);
  }
};

// @desc    根據ID獲取訂單
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await getDocById(COLLECTION, req.params.id);

    if (order) {
      // 獲取用戶信息
      const user = await getDocById('users', order.user);
      
      // 將用戶信息添加到訂單
      const orderWithUser = {
        ...order,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        }
      };
      
      res.json(orderWithUser);
    } else {
      res.status(404);
      throw new Error('訂單未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('獲取訂單失敗: ' + error.message);
  }
};

// @desc    更新訂單為已付款
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await getDocById(COLLECTION, req.params.id);

    if (order) {
      // 準備付款數據
      const paymentData = {
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer?.email_address,
        },
      };

      const updatedOrder = await updateDoc(COLLECTION, req.params.id, paymentData);
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('訂單未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('更新付款狀態失敗: ' + error.message);
  }
};

// @desc    更新訂單為已發貨
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await getDocById(COLLECTION, req.params.id);

    if (order) {
      // 更新發貨狀態
      const deliveryData = {
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      };

      const updatedOrder = await updateDoc(COLLECTION, req.params.id, deliveryData);
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('訂單未找到');
    }
  } catch (error) {
    res.status(500);
    throw new Error('更新發貨狀態失敗: ' + error.message);
  }
};

// @desc    獲取登入用戶的訂單
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // 查詢用戶的訂單
    const orders = await queryDocs(COLLECTION, 'user', '==', req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error('獲取我的訂單失敗: ' + error.message);
  }
};

// @desc    獲取所有訂單
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    // 獲取所有訂單
    const orders = await getAllDocs(COLLECTION);
    
    // 為每個訂單添加用戶信息
    const ordersWithUserInfo = await Promise.all(
      orders.map(async (order) => {
        try {
          const user = await getDocById('users', order.user);
          return {
            ...order,
            user: {
              id: user.id,
              name: user.name,
            },
          };
        } catch (error) {
          // 如果找不到用戶，返回原始訂單
          return order;
        }
      })
    );
    
    res.json(ordersWithUserInfo);
  } catch (error) {
    res.status(500);
    throw new Error('獲取所有訂單失敗: ' + error.message);
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
