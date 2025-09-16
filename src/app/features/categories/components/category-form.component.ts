import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { slugPatternValidator, uniqueCategoryNameValidator } from '../validators/category.validators';
import { DebounceClickDirective } from '../../../shared/directives/debounce-click.directive';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DebounceClickDirective],
  template: `
<section class="max-w-2xl mx-auto px-4 py-8">
  <a routerLink="/categories" class="text-sm text-gray-600 hover:underline">← Retour à la liste</a>
  <h1 class="text-2xl font-semibold mt-2 mb-6">{{ isEdit() ? 'Éditer' : 'Créer' }} une catégorie</h1>

  <form [formGroup]="form" class="space-y-4">
    <div>
      <label class="block text-sm mb-1">Nom</label>
      <input type="text" formControlName="name" class="w-full border rounded-lg px-3 py-2" placeholder="Ex: Chaussures">
      @if (form.controls.name.touched && form.controls.name.errors?.['required']) {
        <p class="text-sm text-red-600 mt-1">Nom requis.</p>
      }
      @if (form.controls.name.touched && form.controls.name.errors?.['nameTaken']) {
        <p class="text-sm text-red-600 mt-1">Ce nom existe déjà.</p>
      }
    </div>

    <div>
      <label class="block text-sm mb-1">Slug</label>
      <input type="text" formControlName="slug" class="w-full border rounded-lg px-3 py-2" placeholder="ex: chaussures">
      @if (form.controls.slug.touched && form.controls.slug.errors?.['slugInvalid']) {
        <p class="text-sm text-red-600 mt-1">Format invalide (a-z, 0-9, tirets).</p>
      }
    </div>

    <div>
      <label class="block text-sm mb-1">Description</label>
      <textarea formControlName="description" rows="4" class="w-full border rounded-lg px-3 py-2"></textarea>
    </div>

    <label class="inline-flex items-center gap-2 select-none">
      <input type="checkbox" formControlName="isActive" class="w-4 h-4">
      Active
    </label>

    <div class="flex gap-3 pt-2">
      <button type="button" class="px-4 py-2 rounded-lg border hover:bg-gray-50" routerLink="/categories">Annuler</button>
      <button type="button" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              [disabled]="form.invalid || loading()" appDebounceClick (appDebounceClick)="save()">
        {{ isEdit() ? 'Enregistrer' : 'Créer' }}
      </button>
    </div>
  </form>
</section>
  `
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(CategoryService);

  loading = signal(false);
  isEdit = signal(false);
  id: string | null = null;

  form = this.fb.nonNullable.group({
    name:    ['', { validators: [Validators.required], asyncValidators: [uniqueCategoryNameValidator()], updateOn: 'blur' }],
    slug:    ['', [slugPatternValidator()]],
    description: [''],
    isActive: [true],
  });

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!this.id);

    if (this.id) {
      const cat = await this.svc.getById(this.id);
      if (cat) this.form.patchValue(cat);
    }

    // Auto-slug: si l'utilisateur vide le slug, on régénère depuis le nom
    this.form.controls.name.valueChanges.subscribe(v => {
      const currentSlug = this.form.controls.slug.value?.trim() ?? '';
      if (!currentSlug) this.form.controls.slug.setValue(this.slugify(v ?? ''), { emitEvent: false });
    });
  }

  private slugify(s: string) {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  async save() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const payload = this.form.getRawValue();

    if (this.isEdit() && this.id) {
      await this.svc.update(this.id, payload);
    } else {
      await this.svc.create(payload as any); // id/createdAt gérés côté mock API
    }
    this.loading.set(false);
    this.router.navigateByUrl('/categories');
  }
}
