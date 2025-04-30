import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      config.headers.Authorization = `Bearer ${userInfo.token}`
    }
    console.log('發送請求:', config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('請求發送錯誤:', error)
    return Promise.reject(error)
  }
)

// 響應攔截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('請求成功:', response.config.method.toUpperCase(), response.config.url)
    return response
  },
  (error) => {
    console.error('請求失敗:', error.config?.method?.toUpperCase(), error.config?.url, error.message)
    if (error.response) {
      console.error('伺服器回應:', error.response.status, error.response.data)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance