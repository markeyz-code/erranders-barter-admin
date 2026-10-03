import { GATEWAY_ENDPOINT } from '../axios.config';
export const escrowApi = {
  initiate: (data: any) => GATEWAY_ENDPOINT.post('/escrow/initiate', data),
  release: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/release`),
  dispute: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/dispute`),
  myTransactions: () => GATEWAY_ENDPOINT.get('/escrow/my-transactions')
};