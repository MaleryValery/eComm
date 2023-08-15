import { Customer } from '@commercetools/platform-sdk';

class AuthService {
  static setUser(user: Customer): void {
    const userJson = JSON.stringify(user);
    localStorage.setItem('user', userJson);
  }

  static getUser(): string | undefined {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = JSON.parse(userJson) as Customer;
      return userData.firstName;
    }
    return undefined;
  }

  static deleteUser(): void {
    localStorage.removeItem('user');
  }
}

export default AuthService;
