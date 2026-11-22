import ModalConfirm from '~/components/ModalConfirm.vue'
import { getUserErrorMessage } from '~/utils/userErrorMessage'
import type { UserFormValues } from '~~/shared/types/user'

interface UpdateUserAction {
  id: string
  updateForm: UserFormValues
}

export function useUserAction() {
  const toast = useToast()
  const overlay = useOverlay()

  const createForm = reactive<UserFormValues>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  const updateForm = reactive<UserFormValues>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  async function createUser() {
    try {
      await $fetch('/api/users', { method: 'POST', body: createForm })
      toast.add({ title: 'User created successfully', color: 'success' })
      await navigateTo('/admin/users')
    } catch (error) {
      toast.add({ title: `Unable to create user: ${getUserErrorMessage(error)}`, color: 'error' })
    }
  }

  async function editUser({ id, updateForm: form }: UpdateUserAction) {
    if (!id) {
      toast.add({ title: 'A valid user ID is required', color: 'error' })
      return
    }

    try {
      await $fetch(`/api/users/${id}`, { method: 'PUT', body: form })
      toast.add({ title: 'User updated successfully', color: 'success' })
      await navigateTo('/admin/users')
    } catch (error) {
      toast.add({ title: `Unable to update user: ${getUserErrorMessage(error)}`, color: 'error' })
    }
  }

  async function deleteUser(id: string, refreshAction: () => Promise<unknown>) {
    const modal = overlay.create(ModalConfirm)
    const instance = modal.open({
      title: 'Delete user',
      description: 'This action cannot be undone. The user will also be deleted from Supabase Auth.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'error'
    })

    if (await instance.result !== true) {
      return
    }

    try {
      await $fetch(`/api/users/${id}`, { method: 'DELETE' })
      await refreshAction()
      toast.add({ title: 'User deleted successfully', color: 'success' })
    } catch (error) {
      toast.add({ title: `Unable to delete user: ${getUserErrorMessage(error)}`, color: 'error' })
    }
  }

  return { createForm, updateForm, createUser, editUser, deleteUser }
}
