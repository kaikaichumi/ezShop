import axiosInstance from './axios'

export const createOrder = async (order) => {
  try {
    const { data } = await axiosInstance.post('/orders', order)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getOrderDetails = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/orders/${id}`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const payOrder = async (orderId, paymentResult) => {
  try {
    const { data } = await axiosInstance.put(`/orders/${orderId}/pay`, paymentResult)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const deliverOrder = async (orderId) => {
  try {
    const { data } = await axiosInstance.put(`/orders/${orderId}/deliver`, {})
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const listMyOrders = async () => {
  try {
    const { data } = await axiosInstance.get(`/orders/myorders`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const listOrders = async () => {
  try {
    const { data } = await axiosInstance.get(`/orders`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}