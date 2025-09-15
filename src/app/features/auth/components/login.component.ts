import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<section class="max-w-md mx-auto px-4 py-10">
  <h1 class="text-2xl font-semibold mb-6">Connexion</h1>

  <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
    <div>
      <label class="block text-sm mb-1">Email</label>
      <input type="email" class="w-full border rounded-lg px-3 py-2"
             formControlName="email" placeholder="you@example.com">
      @if (form.controls.email.touched && form.controls.email.invalid) {
        <p class="text-sm text-red-600 mt-1">Email invalide.</p>
      }
    </div>

    <div>
      <label class="block text-sm mb-1">Mot de passe</label>
      <input type="password" class="w-full border rounded-lg px-3 py-2"
             formControlName="password" placeholder="••••••••">
      @if (form.controls.password.touched && form.controls.password.invalid) {
        <p class="text-sm text-red-600 mt-1">Mot de passe requis (min 6).</p>
      }
    </div>

    <button [disabled]="form.invalid || loading"
            class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
      @if (loading) { <span class="animate-spin inline-block w-4 h-4 border-b-2 border-white mr-2 rounded-full"></span> }
      Se connecter
    </button>

    <p class="text-sm text-gray-600">
      Pas de compte ?
      <a routerLink="/auth/register" class="text-blue-600 hover:underline">Créer un compte</a>
    </p>
  </form>
</section>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);

  loading = false;
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    const result = await this.auth.login(email, password);
    this.loading = false;

    if (result.ok) {
      this.notify.success('Connexion réussie');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/catalog';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.notify.error(result.error);
    }
  }
}
