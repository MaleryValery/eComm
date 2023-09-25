import { TokenStore, TokenCache } from '@commercetools/sdk-client-v2';

const tokenCache: TokenCache = {
  get: (): TokenStore => {
    const dataTokenCache = localStorage.getItem('sntToken');
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
    const dataTokenCache = localStorage.getItem('sntToken');
    if (!dataTokenCache) localStorage.setItem('sntToken', JSON.stringify(tokenData));
  },
};

export default tokenCache;
