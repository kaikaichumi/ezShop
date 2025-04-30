import { defineStore } from 'pinia'
import { getProductDetails } from '@/api/productApi'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    loading: false,
    error: null
  }),
  getters: {
    itemsCount: (state) => state.cartItems.reduce((acc, item) => acc + item.qty, 0),
    cartTotal: (state) =>
      state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
    taxAmount: (state) => +(state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.05).toFixed(2),
    shippingAmount: (state) => 
      state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) > 500 
        ? 0 
        : 100,
    totalAmount: (state) => {
      const subtotal = state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
      const tax = +(subtotal * 0.05).toFixed(2)
      const shipping = subtotal > 500 ? 0 : 100
      return +(subtotal + tax + shipping).toFixed(2)
    }
  },
  actions: {
    async addToCart(id, qty) {
      try {
        this.loading = true
        this.error = null
        const product = await getProductDetails(id)
        const existItem = this.cartItems.find((x) => x.product === id)

        if (existItem) {
          this.cartItems = this.cartItems.map((x) =>
            x.product === existItem.product ? { ...x, qty } : x
          )
        } else {
          this.cartItems = [
            ...this.cartItems,
            {
              product: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              countInStock: product.countInStock,
              qty
            }
          ]
        }
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    removeFromCart(id) {
      this.cartItems = this.cartItems.filter((x) => x.product !== id)
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
    },
    saveShippingAddress(data) {
      this.shippingAddress = data
      localStorage.setItem('shippingAddress', JSON.stringify(data))
    },
    savePaymentMethod(data) {
      this.paymentMethod = data
      localStorage.setItem('paymentMethod', data)
    },
    clearCartItems() {
      this.cartItems = []
      localStorage.removeItem('cartItems')
    }
  }
})