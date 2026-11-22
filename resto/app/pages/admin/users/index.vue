<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column, Row } from '@tanstack/vue-table'
import type { User } from '~~/shared/types/user'
import { useDashboardSearch } from '~/composables/useDashboardSearch'
import { getUserErrorMessage } from '~/utils/userErrorMessage'

definePageMeta({
  layout: 'admin-resource',
  middleware: 'admin',
  title: 'Users',
  searchPlaceholder: 'Search users...',
  navItems: [
    { label: 'Products', to: '/admin/products', icon: 'i-lucide-package' },
    { label: 'Categories', to: '/admin/categories', icon: 'i-lucide-tags' },
    { label: 'Users', to: '/admin/users', icon: 'i-lucide-users' }
  ]
})

const { search } = useDashboardSearch()
const { data: users, error, pending, refresh } = await useFetch<User[]>('/api/users', {
  query: computed(() => ({ search: search.value.trim() }))
})
const { deleteUser } = useUserAction()
const fetchErrorMessage = computed(() => getUserErrorMessage(error.value))

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

function getHeader(column: Column<User, unknown>, label: string) {
  const sorted = column.getIsSorted()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: sorted
      ? sorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'
      : 'i-lucide-arrow-up-down',
    class: '-mx-2.5',
    onClick: () => column.toggleSorting()
  })
}

function getRowItems(row: Row<User>) {
  return [
    [{
      label: 'Edit user',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/admin/users/edit/${row.original.id}`)
    }],
    [{
      label: 'Delete user',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => deleteUser(row.original.id, refresh)
    }]
  ]
}

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Name')
  },
  {
    accessorKey: 'email',
    header: ({ column }) => getHeader(column, 'Email')
  },
  {
    accessorKey: 'role',
    header: ({ column }) => getHeader(column, 'Role'),
    cell: ({ row }) => h(UBadge, {
      color: row.original.role === 'admin' ? 'primary' : 'warning',
      variant: 'subtle'
    }, () => row.original.role)
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => getHeader(column, 'Created'),
    cell: ({ row }) => new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(row.original.created_at))
  },
  {
    id: 'actions',
    cell: ({ row }) => h(
      UDropdownMenu,
      { items: getRowItems(row) },
      () => h(UButton, {
        'icon': 'i-lucide-ellipsis',
        'color': 'neutral',
        'variant': 'ghost',
        'aria-label': `Actions for ${row.original.name}`
      })
    )
  }
]
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-highlighted">
          Manage users
        </h2>
        <p class="text-sm text-muted">
          Create, edit, and remove restaurant dashboard accounts.
        </p>
      </div>
      <UButton
        to="/admin/users/create"
        icon="i-lucide-plus"
      >
        Create user
      </UButton>
    </div>

    <UAlert
      v-if="error"
      color="error"
      title="Unable to load users"
      :description="fetchErrorMessage"
    />

    <UTable
      :data="users ?? []"
      :columns="columns"
      :loading="pending"
      class="flex-1"
    />
  </section>
</template>
