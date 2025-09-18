import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const frenchPostalCodeValidator = (): ValidatorFn => {
  const re = /^\d{5}$/;
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    return v && !re.test(v) ? { postalCodeInvalid: true } : null;
  };
};

export const phoneValidator = (): ValidatorFn => {
  const re = /^[+0-9 ()-]{7,20}$/; // simple
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    if (!v) return null;
    return re.test(v) ? null : { phoneInvalid: true };
  };
};
