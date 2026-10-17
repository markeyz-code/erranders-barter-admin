import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

// Every escrow route is JWT-guarded; the admin routes add AdminGuard.
export const escrowApi = {
  initiate: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/escrow/initiate', data),
  release: (txId: string) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/escrow/${txId}/release`),
  dispute: (txId: string) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/escrow/${txId}/dispute`),
  myTransactions: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/escrow/my-transactions'),
};
