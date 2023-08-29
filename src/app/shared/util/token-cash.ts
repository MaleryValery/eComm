import { TokenStore, TokenCache } from '@commercetools/sdk-client-v2';

const tokenCache: TokenCache = {
  get: (): TokenStore => {
    const dataTokenCache = localStorage.getItem('token');
    if (dataTokenCache) {
      const tokenLsData = JSON.parse(dataTokenCache);
      return {
        token: `Bearer:${tokenLsData.token}`,
        expirationTime: 0,
        refreshToken: '',
      };
    }
    return { token: '', expirationTime: 0, refreshToken: '' };
  },
  set: (tokenData): void => {
    const dataTokenCache = localStorage.getItem('token');
    if (!dataTokenCache) localStorage.setItem('token', JSON.stringify(tokenData));
  },
};

export default tokenCache;
