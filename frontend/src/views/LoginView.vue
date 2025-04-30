<template>
  <div class="form-container">
    <h1 class="my-3">登入</h1>
    <Message v-if="error" variant="danger">{{ error }}</Message>
    <form @submit.prevent="submitHandler">
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
      <button type="submit" class="btn btn-primary" :disabled="loading">
        登入
      </button>
    </form>
    <div class="py-3">
      新用戶?
      <router-link :to="`/register${redirect ? `?redirect=${redirect}` : ''}`">
        註冊
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
  name: 'LoginView',
  components: { Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const email = ref('')
    const password = ref('')

    // 從路由獲取重定向路徑
    const redirect = computed(() => route.query.redirect || '/')
    const error = computed(() => userStore.error)
    const loading = computed(() => userStore.loading)
    const userInfo = computed(() => userStore.userInfo)

    const submitHandler = async () => {
      await userStore.login(email.value, password.value)
      // 登入成功後重定向
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
      email,
      password,
      redirect,
      error,
      loading,
      submitHandler
    }
  }
}
</script>