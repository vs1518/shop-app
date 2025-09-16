import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { inject } from '@angular/core';

export const slugPatternValidator = (): ValidatorFn => {
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').trim();
    return v && !re.test(v) ? { slugInvalid: true } : null;
  };
};

export const uniqueCategoryNameValidator = (): AsyncValidatorFn => {
  const svc = inject(CategoryService);
  return async (c: AbstractControl): Promise<ValidationErrors | null> => {
    const v = (c.value ?? '').toString().trim();
    if (!v) return null;
    const exists = await svc.existsByName(v);
    return exists ? { nameTaken: true } : null;
  };
};
