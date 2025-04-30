import axiosInstance from './axios'

export const login = async (email, password) => {
  try {
    const { data } = await axiosInstance.post('/users/login', { email, password })
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const register = async (name, email, password) => {
  try {
    const { data } = await axiosInstance.post('/users', { name, email, password })
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserProfile = async () => {
  try {
    const { data } = await axiosInstance.get('/users/profile')
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const updateUserProfile = async (user) => {
  try {
    const { data } = await axiosInstance.put('/users/profile', user)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// 管理員API
export const getUsers = async () => {
  try {
    const { data } = await axiosInstance.get('/users')
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const deleteUser = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/users/${id}`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/users/${id}`)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const updateUser = async (user) => {
  try {
    const { data } = await axiosInstance.put(`/users/${user._id}`, user)
    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}