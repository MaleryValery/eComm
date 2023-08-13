import ValidationErrors from '../types/validation-errors';
import ValidationFn from '../types/validation-fn';

class ValidatorController {
  public static required: ValidationFn<string> = (value) => {
    if (!value) {
      return { required: true };
    }

    return null;
  };

  public static validateEmail: ValidationFn<string> = (email) => {
    const errors: ValidationErrors = {};

    if (email !== email.trim()) {
      errors.trailingWhitespaces = true;
    }

    if (email.indexOf('@') === -1) {
      errors.missingAtSymbol = true;
    } else {
      const [localPart, domain] = email.split('@');
      if (!domain || email.indexOf('.') === -1 || !/\.[^.]+$/.test(domain)) {
        errors.missingDomainName = true;
      }
      if (!localPart) {
        errors.missingLocalName = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  public static validatePassword: ValidationFn<string> = (password) => {
    const errors: ValidationErrors = {};

    if (password !== password.trim()) {
      errors.trailingWhitespaces = true;
    }
    if (password.length < 8) {
      errors.short = true;
    }
    if (!/[A-Z]/.test(password)) {
      errors.missingUppercaseLatter = true;
    }
    if (!/[a-z]/.test(password)) {
      errors.missingLowercaseLatter = true;
    }
    if (!/\d/.test(password)) {
      errors.missingDigit = true;
    }
    if (!/[@!#$%^&*]/.test(password)) {
      errors.missingSpecialCharacter = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

export default ValidatorController;
