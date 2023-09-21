import validationErrorsPipe from '../../app/shared/util/validation-errors-pipe';
import ValidationErrors from '../../app/shared/types/validation-errors';

describe('validationErrorsPipe', () => {
  test('should return null for null or empty errors', () => {
    expect(validationErrorsPipe(null)).toBe(null);
    expect(validationErrorsPipe({} as ValidationErrors)).toBe(null);
  });

  test('should return "This field is mandatory" for required errors', () => {
    expect(validationErrorsPipe({ required: true })).toBe('This field is mandatory');
  });

  test('should return "This field must not contain leading or trailing whitespace" for trailingWhitespaces errors', () => {
    expect(validationErrorsPipe({ trailingWhitespaces: true })).toBe(
      'This field must not contain leading or trailing whitespace.'
    );
  });

  test('should return "Email address must contain an "@" symbol separating local part and domain name." for missingAtSymbol errors', () => {
    expect(validationErrorsPipe({ missingAtSymbol: true })).toBe(
      'Email address must contain an "@" symbol separating local part and domain name.'
    );
  });

  test('should return "Email address must contain a domain name (e.g., example.com)." for missingDomainName errors', () => {
    expect(validationErrorsPipe({ missingDomainName: true })).toBe(
      'Email address must contain a domain name (e.g., example.com).'
    );
  });

  test('should return "Email address must contain a local name (e.g., example.com)." for missingLocalName errors', () => {
    expect(validationErrorsPipe({ missingLocalName: true })).toBe(
      'Email address must contain a local name (e.g., example.com).'
    );
  });

  test('should return "Password must be at least 8 characters long." for short errors', () => {
    expect(validationErrorsPipe({ short: true })).toBe('Password must be at least 8 characters long.');
  });

  test('should return "Password must contain at least one uppercase letter (A-Z)." for missingUppercaseLatter errors', () => {
    expect(validationErrorsPipe({ missingUppercaseLatter: true })).toBe(
      'Password must contain at least one uppercase letter (A-Z).'
    );
  });

  test('should return "Password must contain at least one lowercase letter (a-z)." for missingLowercaseLatter errors', () => {
    expect(validationErrorsPipe({ missingLowercaseLatter: true })).toBe(
      'Password must contain at least one lowercase letter (a-z).'
    );
  });

  test('should return "Password must contain at least one digit (0-9)." for missingDigit errors', () => {
    expect(validationErrorsPipe({ missingDigit: true })).toBe('Password must contain at least one digit (0-9).');
  });

  test('should return "Password must contain at least one special character (@!#$%^&*)." for missingSpecialCharacter errors', () => {
    expect(validationErrorsPipe({ missingSpecialCharacter: true })).toBe(
      'Password must contain at least one special character (@!#$%^&*).'
    );
  });

  test('should return "The passwords don\'t match" for mismatch errors', () => {
    expect(validationErrorsPipe({ mismatch: true })).toBe("The passwords don't match");
  });

  test('should return "This field must contain at least one letter" for missingLetter errors', () => {
    expect(validationErrorsPipe({ missingLetter: true })).toBe('This field must contain at least one letter');
  });

  test('should return "This field must not contain any special characters or numbers" for containsSpecialOrNumber errors', () => {
    expect(validationErrorsPipe({ containsSpecialOrNumber: true })).toBe(
      'This field must not contain any special characters or numbers'
    );
  });

  test('should return "This field must follow the format for the country" for invalidPostalCode errors', () => {
    expect(validationErrorsPipe({ invalidPostalCode: true })).toBe('This field must follow the format for the country');
  });

  test('should return "This field must contain at least one letter or number" for missingLetterOrNum errors', () => {
    expect(validationErrorsPipe({ missingLetterOrNum: true })).toBe(
      'This field must contain at least one letter or number'
    );
  });

  test('should return "Invalid value" for any other errors', () => {
    const randomErrors = { someRandomError: true } as ValidationErrors;
    expect(validationErrorsPipe(randomErrors)).toBe('Invalid value');
  });
});
