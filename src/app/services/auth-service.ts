import { Customer } from '@commercetools/platform-sdk';

class AuthService {
  static setUser(user: Customer): void {
    const userJson = JSON.stringify(user);
    localStorage.setItem('user', userJson);
  }

  static getUser(): Customer | undefined {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return undefined;
  }

  static deleteUser(): void {
    localStorage.removeItem('user');
  }
}

export default AuthService;
