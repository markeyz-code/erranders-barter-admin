import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const usersApi = {
  /**
   * GET /users/me — the signed-in user.
   *
   * This used the unauthenticated `GATEWAY_ENDPOINT`, so it 401'd: the route is
   * JWT-guarded and that instance sends no bearer token. Switched to the auth
   * instance; the call signature is unchanged.
   */
  getProfile: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me'),
};
