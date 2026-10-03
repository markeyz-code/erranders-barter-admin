import { ref } from 'vue';
import { itemsApi } from '@/api_factory/modules/items';

export const useGetItems = () => {
  const loading = ref(false);
  const items = ref([]);

  const fetchItems = async (params = {}) => {
    loading.value = true;
    try {
      const res = await itemsApi.list(params);
      items.value = res.data;
    } catch (err: any) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  return { loading, items, fetchItems };
};

export const useCreateItem = () => {
  const loading = ref(false);
  const createItem = async (data: any) => {
    loading.value = true;
    try {
      const res = await itemsApi.create(data);
      return res.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return { loading, createItem };
};