import { defineStore } from 'pinia'
import { login, register, updateUserProfile } from '@/api/userApi'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
    loading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      try {
        this.loading = true
        this.error = null
        const data = await login(email, password)
        this.userInfo = data
        localStorage.setItem('userInfo', JSON.stringify(data))
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async register(name, email, password) {
      try {
        this.loading = true
        this.error = null
        const data = await register(name, email, password)
        this.userInfo = data
        localStorage.setItem('userInfo', JSON.stringify(data))
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateProfile(user) {
      try {
        this.loading = true
        this.error = null
        const data = await updateUserProfile(user)
        this.userInfo = data
        localStorage.setItem('userInfo', JSON.stringify(data))
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.userInfo = null
      localStorage.removeItem('userInfo')
    }
  }
})