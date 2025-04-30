<template>
  <div>
    <button class="btn btn-light my-3" @click="$router.go(-1)">返回</button>
    <div class="form-container">
      <h1>編輯用戶</h1>
      <div v-if="loading">
        <Loader />
      </div>
      <Message v-else-if="error" variant="danger">{{ error }}</Message>
      <Message v-if="updateSuccess" variant="success">用戶已更新</Message>
      <form v-if="!loading" @submit.prevent="submitHandler">
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
        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="isAdmin"
            v-model="isAdmin"
          />
          <label class="form-check-label" for="isAdmin">管理員</label>
        </div>
        <button type="submit" class="btn btn-primary">更新</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getUserById, updateUser } from '@/api/userApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'AdminUserEditView',
  components: { Loader, Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const name = ref('')
    const email = ref('')
    const isAdmin = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const updateSuccess = ref(false)

    const userInfo = computed(() => userStore.userInfo)

    const fetchUserDetails = async () => {
      try {
        loading.value = true
        error.value = null
        const user = await getUserById(route.params.id)
        name.value = user.name
        email.value = user.email
        isAdmin.value = user.isAdmin
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const submitHandler = async () => {
      try {
        loading.value = true
        error.value = null
        updateSuccess.value = false
        
        const updatedUser = {
          _id: route.params.id,
          name: name.value,
          email: email.value,
          isAdmin: isAdmin.value
        }
        
        await updateUser(updatedUser)
        updateSuccess.value = true
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (!userInfo.value || !userInfo.value.isAdmin) {
        router.push('/login')
        return
      }
      
      if (route.params.id === userInfo.value._id) {
        error.value = '不能編輯自己的帳戶'
        return
      }
      
      fetchUserDetails()
    })

    return {
      name,
      email,
      isAdmin,
      loading,
      error,
      updateSuccess,
      submitHandler
    }
  }
}
</script>