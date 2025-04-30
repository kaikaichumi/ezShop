import axiosInstance from './axios'

export const getProducts = async (keyword = '', pageNumber = '') => {
  try {
    const { data } = await axiosInstance.get(`/products?keyword=${keyword}&pageNumber=${pageNumber}`)
    
    // 確保所有產品都有 _id 欄位
    if (data && data.products && Array.isArray(data.products)) {
      data.products = data.products.map(product => {
        if (product && product.id && !product._id) {
          return { ...product, _id: product.id }
        }
        return product
      })
    }
    
    return data
  } catch (error) {
    console.error('獲取產品列表失敗:', error)
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getProductDetails = async (id) => {
  try {
    // 檢查ID是否有效
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('無效的產品ID')
    }
    
    console.log('獲取產品詳情，ID:', id)
    const { data } = await axiosInstance.get(`/products/${id}`)
    
    // 確保返回的產品有 _id 欄位
    if (data && !data._id && data.id) {
      data._id = data.id
    }
    
    return data
  } catch (error) {
    console.error('獲取產品詳情失敗:', error)
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const createProductReview = async (productId, review) => {
  try {
    const { data } = await axiosInstance.post(`/products/${productId}/reviews`, review)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getTopProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products/top`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// 管理員API
export const deleteProduct = async (id) => {
  try {
    // 檢查ID是否有效
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('無效的產品ID')
    }
    
    console.log('準備刪除產品，ID:', id, '類型:', typeof id)
    // 確保使用字符串形式的ID
    const productId = String(id)
    console.log('最終刪除產品的ID:', productId)
    
    const { data } = await axiosInstance.delete(`/products/${productId}`)
    return data
  } catch (error) {
    console.error('刪除產品失敗:', error)
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const createProduct = async () => {
  try {
    const { data } = await axiosInstance.post(`/products`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const updateProduct = async (product) => {
  try {
    // 檢查產品和 ID 是否有效
    if (!product || (!product._id && !product.id)) {
      throw new Error('產品或產品ID不存在')
    }
    
    // 確保使用字符串形式的ID
    const productId = String(product._id || product.id)
    console.log('準備更新產品:')
    console.log('- 原始產品:', product)
    console.log('- 使用ID:', productId, '類型:', typeof productId)
    
    const { data } = await axiosInstance.put(`/products/${productId}`, product)
    
    // 確保返回的產品有 _id 欄位
    if (data && !data._id && data.id) {
      data._id = data.id
    }
    
    console.log('更新產品成功，返回資料:', data)
    return data
  } catch (error) {
    console.error('更新產品失敗:', error)
    throw new Error(error.response?.data?.message || error.message)
  }
}