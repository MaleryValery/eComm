import ValidatorController from '../../app/shared/util/validator-controller';

describe('ValidatorController', () => {
  test('should return an error or null', () => {
    expect(ValidatorController.required('')).toEqual({ required: true });
    expect(ValidatorController.required('abc')).toBeNull();
  });

  describe('validateEmail', () => {
    const { validateEmail } = ValidatorController;

    test('should return null for a valid email', () => {
      const result = validateEmail('example@example.com');
      expect(result).toBeNull();
    });

    test('should return an error object for an email with trailing whitespaces', () => {
      const result = validateEmail(' example@example.com ');
      expect(result).toEqual({ trailingWhitespaces: true });
    });

    test('should return an error object for an email without "@" symbol', () => {
      const result = validateEmail('example.com');
      expect(result).toEqual({ missingAtSymbol: true });
    });

    test('should return an error object for an email without domain name', () => {
      const result = validateEmail('example@');
      expect(result).toEqual({ missingDomainName: true });
    });

    test('should return an error object for an email without local name', () => {
      const result = validateEmail('@example.com');
      expect(result).toEqual({ missingLocalName: true });
    });
  });

  describe('validatePassword', () => {
    const { validatePassword } = ValidatorController;

    test('should return null for a valid password', () => {
      const result = validatePassword('ValidPassword1!');
      expect(result).toBeNull();
    });

    test('should return an error object for a password with trailing whitespaces', () => {
      const result = validatePassword(' Password1! ');
      expect(result).toEqual({ trailingWhitespaces: true });
    });

    test('should return an error object for a password that is too short', () => {
      const result = validatePassword('Short1!');
      expect(result).toEqual({ short: true });
    });

    test('should return an error object for a password missing an uppercase letter', () => {
      const result = validatePassword('nocapital1!');
      expect(result).toEqual({ missingUppercaseLatter: true });
    });

    test('should return an error object for a password missing a lowercase letter', () => {
      const result = validatePassword('NOLOWER1!');
      expect(result).toEqual({ missingLowercaseLatter: true });
    });

    test('should return an error object for a password missing a digit', () => {
      const result = validatePassword('NoDigit!');
      expect(result).toEqual({ missingDigit: true });
    });

    test('should return an error object for a password missing a special character', () => {
      const result = validatePassword('NoSpecialCharacter1');
      expect(result).toEqual({ missingSpecialCharacter: true });
    });
  });

  describe('validatePasswordMatch', () => {
    const { validatePasswordMatch } = ValidatorController;

    test('should return null for matching passwords', () => {
      const password = 'Password1!';
      const repeatPassword = 'Password1!';
      const result = validatePasswordMatch(password, repeatPassword);
      expect(result).toBeNull();
    });

    test('should return an error object for mismatched passwords', () => {
      const password = 'Password1!';
      const repeatPassword = 'DifferentPassword1!';
      const result = validatePasswordMatch(password, repeatPassword);
      expect(result).toEqual({ mismatch: true });
    });
  });

  describe('validateMissingLetter', () => {
    const { validateMissingLetter } = ValidatorController;

    test('should return null for a string containing letters', () => {
      const result = validateMissingLetter('abc');
      expect(result).toBeNull();
    });

    test('should return an error object for a string without letters', () => {
      const result = validateMissingLetter('123');
      expect(result).toEqual({ missingLetter: true });
    });
  });

  describe('validatePostalCode', () => {
    const { validatePostalCode } = ValidatorController;

    test('should return null for a valid postal code', () => {
      const postalCode = '12345';
      const countryCode = 'US';
      const result = validatePostalCode(postalCode, countryCode);
      expect(result).toBeNull();
    });

    test('should return an error object for an invalid postal code', () => {
      const postalCode = 'ABC123';
      const countryCode = 'US';
      const result = validatePostalCode(postalCode, countryCode);
      expect(result).toEqual({ invalidPostalCode: true });
    });
  });

  describe('validateContainsSpecialOrNumber', () => {
    const { validateContainsSpecialOrNumber } = ValidatorController;

    test('should return null for a string without special characters or numbers', () => {
      const result = validateContainsSpecialOrNumber('abcdef');
      expect(result).toBeNull();
    });

    test('should return an error object for a string containing special characters or numbers', () => {
      const result = validateContainsSpecialOrNumber('abc@123');
      expect(result).toEqual({ containsSpecialOrNumber: true });
    });
  });

  describe('validateMissingNumberOrLetter', () => {
    const { validateMissingNumberOrLetter } = ValidatorController;

    test('should return null for a string containing letters and numbers', () => {
      const result = validateMissingNumberOrLetter('abc123');
      expect(result).toBeNull();
    });

    test('should return an error object for a string without letters or numbers', () => {
      const result = validateMissingNumberOrLetter('!@#');
      expect(result).toEqual({ missingLetterOrNum: true });
    });
  });
});
