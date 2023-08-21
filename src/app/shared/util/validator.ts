import validator from 'validator';

class ValidatorController {
  static validateEmail(email: string) {
    return validator.isEmail(email);
  }

  static validatePassword(password: string) {
    return validator.isLength(password, { min: 3 });
  }
}

export default ValidatorController;
