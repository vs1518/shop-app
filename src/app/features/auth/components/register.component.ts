import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<section class="max-w-md mx-auto px-4 py-10">
  <h1 class="text-2xl font-semibold mb-6">Créer un compte</h1>

  <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
    <div>
      <label class="block text-sm mb-1">Email</label>
      <input type="email" formControlName="email" class="w-full border rounded-lg px-3 py-2" placeholder="you@example.com">
      @if (form.controls.email.touched && form.controls.email.invalid) {
        <p class="text-sm text-red-600 mt-1">Email invalide.</p>
      }
    </div>

    <div formGroupName="passwords" class="space-y-3">
      <div>
        <label class="block text-sm mb-1">Mot de passe</label>
        <input type="password" formControlName="password" class="w-full border rounded-lg px-3 py-2" placeholder="••••••••">
        @if (form.controls.passwords.get('password')?.touched && form.controls.passwords.get('password')?.invalid) {
          <p class="text-sm text-red-600 mt-1">Min 6 caractères.</p>
        }
      </div>
      <div>
        <label class="block text-sm mb-1">Confirmer le mot de passe</label>
        <input type="password" formControlName="confirmPassword" class="w-full border rounded-lg px-3 py-2" placeholder="••••••••">
        @if (form.controls.passwords.touched && form.controls.passwords.errors?.['passwordMismatch']) {
          <p class="text-sm text-red-600 mt-1">Les mots de passe ne correspondent pas.</p>
        }
      </div>
    </div>

    <button [disabled]="form.invalid || loading"
            class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
      @if (loading) { <span class="animate-spin inline-block w-4 h-4 border-b-2 border-white mr-2 rounded-full"></span> }
      S'inscrire
    </button>

    <p class="text-sm text-gray-600">
      Déjà inscrit ?
      <a routerLink="/auth/login" class="text-blue-600 hover:underline">Se connecter</a>
    </p>
  </form>
</section>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  loading = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator })
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const email = this.form.controls.email.value as string;
    const password = this.form.controls.passwords.controls.password.value as string;

    const result = await this.auth.register(email, password);
    this.loading = false;

    if (result.ok) {
      this.notify.success('Compte créé, vous êtes connecté');
      this.router.navigateByUrl('/catalog');
    } else {
      this.notify.error(result.error);
    }
  }
}
