<template>
  <div class="form-container">
    <h1 class="my-3">註冊</h1>
    <Message v-if="error" variant="danger">{{ error }}</Message>
    <form @submit.prevent="submitHandler">
      <div class="mb-3">
        <label for="name" class="form-label">姓名</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">電子郵件</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">密碼</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          required
        />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">確認密碼</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <Message v-if="passwordError" variant="danger">
        {{ passwordError }}
      </Message>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        註冊
      </button>
    </form>
    <div class="py-3">
      已有帳號?
      <router-link :to="`/login${redirect ? `?redirect=${redirect}` : ''}`">
        登入
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Message from '@/components/Message.vue'

export default {
  name: 'RegisterView',
  components: { Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const passwordError = ref('')

    // 從路由獲取重定向路徑
    const redirect = computed(() => route.query.redirect || '/')
    const error = computed(() => userStore.error)
    const loading = computed(() => userStore.loading)
    const userInfo = computed(() => userStore.userInfo)

    const submitHandler = async () => {
      if (password.value !== confirmPassword.value) {
        passwordError.value = '密碼不匹配!'
        return
      }
      
      passwordError.value = ''
      await userStore.register(name.value, email.value, password.value)
      
      // 註冊成功後重定向
      if (userInfo.value) {
        router.push(redirect.value)
      }
    }

    // 如果已經登入，自動重定向
    onMounted(() => {
      if (userInfo.value) {
        router.push(redirect.value)
      }
    })

    return {
      name,
      email,
      password,
      confirmPassword,
      passwordError,
      redirect,
      error,
      loading,
      submitHandler
    }
  }
}
</script>