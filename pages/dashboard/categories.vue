<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Category Management</h2>
        <p class="text-sm text-slate-500 mt-1">
          Categories for marketplace listings and provider services.
        </p>
      </div>
      <button
        class="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors flex items-center gap-2"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" /> Add Category
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center bg-slate-50/50">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[260px]"
          />
        </div>
        <p class="text-xs font-semibold text-slate-500">
          {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? 'category' : 'categories' }}
        </p>
      </div>

      <div class="flex-1 overflow-x-auto min-h-[350px]">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Loading categories...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <AlertCircle class="w-10 h-10 text-red-500 mb-3" />
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load categories</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="loadCategories" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">
            Try again
          </button>
        </div>

        <div v-else-if="filteredCategories.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <Tags class="w-10 h-10 text-slate-300 mb-3" />
          <h3 class="text-lg font-bold text-slate-900 mb-1">No categories found</h3>
          <p class="text-slate-500 text-sm max-w-sm">
            {{ categories.length === 0 ? 'No categories exist in the database yet.' : 'No categories match your search query.' }}
          </p>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Icon Identifier</th>
              <th scope="col" class="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="cat in filteredCategories" :key="cat._id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center font-bold text-brand-700">
                    <Tags class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="text-sm font-bold text-slate-900">{{ cat.name }}</span>
                    <p class="text-xs text-slate-400 font-mono">{{ cat._id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  {{ cat.icon || 'tag' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'System default' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="inline-flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
                    @click="openEditModal(cat)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40"
                    :disabled="deletingId === cat._id"
                    @click="askDelete(cat)"
                  >
                    {{ deletingId === cat._id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 shadow-xl">
          <h3 class="text-lg font-bold text-slate-900 mb-1">
            {{ isEditing ? 'Edit Category' : 'Create New Category' }}
          </h3>
          <p class="text-slate-500 text-xs mb-5">
            {{ isEditing ? 'Update category name and icon identifier.' : 'Add a new category for student items and services.' }}
          </p>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category Name</label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="e.g. Graphic Design & Tech"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Icon Identifier</label>
              <input
                v-model="formData.icon"
                type="text"
                placeholder="e.g. spark, laptop, palette, book"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-brand-500"
              />
              <p class="text-[11px] text-slate-400 mt-1">Lucide icon name identifier (e.g. smartphone, book, smile, sparkles).</p>
            </div>

            <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
              {{ formError }}
            </div>

            <div class="flex gap-3 justify-end pt-3">
              <button
                type="button"
                @click="modalOpen = false"
                class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="confirmDeleteCategory" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Delete Category</h3>
          <p class="text-slate-500 text-sm mb-6">
            Are you sure you want to delete <strong class="text-slate-800">"{{ confirmDeleteCategory.name }}"</strong>? Items referencing this category may need reassignment.
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="confirmDeleteCategory = null" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl">
              Cancel
            </button>
            <button @click="executeDelete" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Tags, Loader2, AlertCircle } from 'lucide-vue-next';
import { adminManagementApi, type AdminCategory } from '~/api_factory/modules/adminManagement';

const categories = ref<AdminCategory[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const deletingId = ref('');

const modalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref('');
const formData = ref({ name: '', icon: '' });
const formError = ref('');
const saving = ref(false);

const confirmDeleteCategory = ref<AdminCategory | null>(null);

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return categories.value;
  return categories.value.filter((c) =>
    (c.name || '').toLowerCase().includes(q) || (c.icon || '').toLowerCase().includes(q)
  );
});

const loadCategories = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listCategories();
    categories.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not load categories';
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = '';
  formData.value = { name: '', icon: '' };
  formError.value = '';
  modalOpen.value = true;
};

const openEditModal = (cat: AdminCategory) => {
  isEditing.value = true;
  editingId.value = cat._id;
  formData.value = { name: cat.name || '', icon: cat.icon || '' };
  formError.value = '';
  modalOpen.value = true;
};

const saveCategory = async () => {
  if (!formData.value.name.trim()) {
    formError.value = 'Category name is required';
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    if (isEditing.value) {
      const { data } = await adminManagementApi.updateCategory(editingId.value, {
        name: formData.value.name.trim(),
        icon: formData.value.icon.trim() || undefined,
      });
      const idx = categories.value.findIndex((c) => c._id === editingId.value);
      if (idx >= 0) categories.value[idx] = data;
    } else {
      const { data } = await adminManagementApi.createCategory({
        name: formData.value.name.trim(),
        icon: formData.value.icon.trim() || undefined,
      });
      categories.value.push(data);
    }
    modalOpen.value = false;
  } catch (err: any) {
    formError.value = err?.response?.data?.message || 'Failed to save category';
  } finally {
    saving.value = false;
  }
};

const askDelete = (cat: AdminCategory) => {
  confirmDeleteCategory.value = cat;
};

const executeDelete = async () => {
  if (!confirmDeleteCategory.value) return;
  const target = confirmDeleteCategory.value;
  confirmDeleteCategory.value = null;
  deletingId.value = target._id;
  try {
    await adminManagementApi.deleteCategory(target._id);
    categories.value = categories.value.filter((c) => c._id !== target._id);
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Could not delete category');
  } finally {
    deletingId.value = '';
  }
};

onMounted(loadCategories);
</script>
