import { postcodeValidator } from 'postcode-validator';
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

  public static validatePasswordMatch(password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
      return { mismatch: true };
    }

    return null;
  }

  public static validateMissingLetter: ValidationFn<string> = (value) => {
    if (!/[a-zA-Z]/.test(value)) {
      return { missingLetter: true };
    }
    return null;
  };

  public static validatePostalCode(postalCode: string, countryCode: string) {
    if (!postcodeValidator(postalCode, countryCode)) {
      return { invalidPostalCode: true };
    }
    return null;
  }

  public static validateContainsSpecialOrNumber: ValidationFn<string> = (value) => {
    if (/[!@#$%^&*0-9]/.test(value)) {
      return { containsSpecialOrNumber: true };
    }

    return null;
  };

  public static validateMissingNumberOrLetter: ValidationFn<string> = (value) => {
    if (!/[a-zA-Z\d]/.test(value)) {
      return { missingLetterOrNum: true };
    }
    return null;
  };
}

export default ValidatorController;
