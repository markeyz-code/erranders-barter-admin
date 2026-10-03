import { ref } from 'vue';
import { escrowApi } from '@/api_factory/modules/escrow';

export const useEscrowTransactions = () => {
  const loading = ref(false);
  const transactions = ref([]);
  
  const fetchTransactions = async () => {
    loading.value = true;
    try {
      const res = await escrowApi.myTransactions();
      transactions.value = res.data;
    } catch (err: any) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  return { loading, transactions, fetchTransactions };
};