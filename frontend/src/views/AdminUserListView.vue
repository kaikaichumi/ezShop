<template>
  <div>
    <h1>用戶</h1>
    <div v-if="loading">
      <Loader />
    </div>
    <Message v-else-if="error" variant="danger">{{ error }}</Message>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>電子郵件</th>
            <th>管理員</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user._id }}</td>
            <td>{{ user.name }}</td>
            <td>
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </td>
            <td>
              <i
                :class="user.isAdmin ? 'fas fa-check text-success' : 'fas fa-times text-danger'"
              ></i>
            </td>
            <td>
              <router-link
                :to="`/admin/user/${user._id}/edit`"
                v-if="user._id !== userInfo._id"
                class="btn btn-sm btn-light me-2"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button
                v-if="user._id !== userInfo._id"
                class="btn btn-sm btn-danger"
                @click="deleteHandler(user._id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getUsers, deleteUser } from '@/api/userApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'AdminUserListView',
  components: { Loader, Message },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userInfo = computed(() => userStore.userInfo)

    const fetchUsers = async () => {
      try {
        loading.value = true
        error.value = null
        users.value = await getUsers()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const deleteHandler = async (id) => {
      if (confirm('確定要刪除此用戶嗎？')) {
        try {
          loading.value = true
          error.value = null
          await deleteUser(id)
          fetchUsers()
        } catch (err) {
          error.value = err.message
        } finally {
          loading.value = false
        }
      }
    }

    onMounted(() => {
      if (!userInfo.value || !userInfo.value.isAdmin) {
        router.push('/login')
        return
      }
      
      fetchUsers()
    })

    return {
      users,
      loading,
      error,
      userInfo,
      deleteHandler
    }
  }
}
</script>