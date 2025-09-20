import { FormControl } from '@angular/forms';
import { frenchPostalCodeValidator } from './postal-phone.validators';

describe('frenchPostalCodeValidator', () => {
  const v = frenchPostalCodeValidator();

  it('accepts 5 digits', () => {
    expect(v(new FormControl('75001'))).toBeNull();
  });

  it('rejects invalid formats', () => {
    expect(v(new FormControl('7500A'))).toEqual({ postalCodeInvalid: true });
    expect(v(new FormControl('123'))).toEqual({ postalCodeInvalid: true });
  });
});
