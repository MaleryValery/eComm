import ValidationErrors from '../types/validation-errors';

function validationErrorsPipe(errors: ValidationErrors | null): string | null {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  if (errors.required) {
    return 'This field is mandatory';
  }

  if (errors.trailingWhitespaces) {
    return 'This field must not contain leading or trailing whitespace.';
  }
  if (errors.missingAtSymbol) {
    return 'Email address must contain an "@" symbol separating local part and domain name.';
  }
  if (errors.missingDomainName) {
    return 'Email address must contain a domain name (e.g., example.com).';
  }
  if (errors.missingLocalName) {
    return 'Email address must contain a local name (e.g., example.com).';
  }

  if (errors.short) {
    return 'Password must be at least 8 characters long.';
  }
  if (errors.missingUppercaseLatter) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (errors.missingLowercaseLatter) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (errors.missingDigit) {
    return 'Password must contain at least one digit (0-9).';
  }
  if (errors.missingSpecialCharacter) {
    return 'Password must contain at least one special character (@!#$%^&*).';
  }
  if (errors.mismatch) {
    return "The passwords don't match";
  }
  if (errors.missingLetter) {
    return 'This field must contain at least one character';
  }
  if (errors.containsSpecialOrNumber) {
    return 'This field must not contain any special characters or numbers';
  }
  if (errors.invalidPostalCode) {
    return 'This field must follow the format for the country';
  }

  return 'Invalid value';
}

export default validationErrorsPipe;
