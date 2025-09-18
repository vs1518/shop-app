import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { AuthService } from '../../auth/services/auth.service';
import { OrderService } from '../services/order.service';
import { frenchPostalCodeValidator, phoneValidator } from '../validators/postal-phone.validators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<section class="max-w-6xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[1fr_380px]">
  <div>
    <h1 class="text-2xl font-semibold mb-6">Finaliser la commande</h1>

    <form [formGroup]="form" class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Prénom</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="firstName">
          @if (form.controls.firstName.touched && form.controls.firstName.invalid) {
            <p class="text-sm text-red-600 mt-1">Requis.</p>
          }
        </div>
        <div>
          <label class="block text-sm mb-1">Nom</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="lastName">
          @if (form.controls.lastName.touched && form.controls.lastName.invalid) {
            <p class="text-sm text-red-600 mt-1">Requis.</p>
          }
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input type="email" class="w-full border rounded-lg px-3 py-2" formControlName="email">
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <p class="text-sm text-red-600 mt-1">Email invalide.</p>
          }
        </div>
        <div>
          <label class="block text-sm mb-1">Téléphone (optionnel)</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="phone">
          @if (form.controls.phone.touched && form.controls.phone.errors?.['phoneInvalid']) {
            <p class="text-sm text-red-600 mt-1">Format incorrect.</p>
          }
        </div>
      </div>

      <div>
        <label class="block text-sm mb-1">Adresse</label>
        <input class="w-full border rounded-lg px-3 py-2" formControlName="line1">
        @if (form.controls.line1.touched && form.controls.line1.invalid) {
          <p class="text-sm text-red-600 mt-1">Requis.</p>
        }
      </div>
      <div>
        <label class="block text-sm mb-1">Complément (facultatif)</label>
        <input class="w-full border rounded-lg px-3 py-2" formControlName="line2">
      </div>

      <div class="grid sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm mb-1">Ville</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="city">
          @if (form.controls.city.touched && form.controls.city.invalid) {
            <p class="text-sm text-red-600 mt-1">Requis.</p>
          }
        </div>
        <div>
          <label class="block text-sm mb-1">Code postal</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="postalCode">
          @if (form.controls.postalCode.touched && form.controls.postalCode.errors?.['postalCodeInvalid']) {
            <p class="text-sm text-red-600 mt-1">Code postal invalide.</p>
          }
        </div>
        <div>
          <label class="block text-sm mb-1">Pays</label>
          <input class="w-full border rounded-lg px-3 py-2" formControlName="country">
          @if (form.controls.country.touched && form.controls.country.invalid) {
            <p class="text-sm text-red-600 mt-1">Requis.</p>
          }
        </div>
      </div>

      <div class="pt-2">
        <button type="button"
                class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                [disabled]="form.invalid || loading()"
                (click)="submit()">
          Passer la commande
        </button>
        <a routerLink="/cart" class="ml-3 text-gray-600 hover:underline">Retour au panier</a>
      </div>
    </form>
  </div>

  <aside class="h-fit border rounded-xl p-4 bg-white">
    <h2 class="font-semibold mb-3">Résumé</h2>
    <div class="space-y-2 mb-4">
      @for (it of cart.items(); track it.product.id) {
        <div class="flex justify-between text-sm">
          <span class="truncate">{{ it.product.name }} × {{ it.qty }}</span>
          <span>{{ (it.product.price * it.qty) | number:'1.0-0' }} €</span>
        </div>
      }
    </div>
    <div class="flex justify-between font-semibold text-lg">
      <span>Total</span>
      <span>{{ cart.totalPrice() | number:'1.0-0' }} €</span>
    </div>
  </aside>
</section>
  `
})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  cart = inject(CartService);
  auth = inject(AuthService);
  orders = inject(OrderService);
  router = inject(Router);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     [this.auth.current()?.email ?? '', [Validators.required, Validators.email]],
    phone:     ['', [phoneValidator()]],
    line1:     ['', Validators.required],
    line2:     [''],
    city:      ['', Validators.required],
    postalCode:['', [frenchPostalCodeValidator()]],
    country:   ['France', Validators.required],
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const items = this.cart.items().map(i => ({
      productId: i.product.id,
      name: i.product.name,
      unitPrice: i.product.price,
      qty: i.qty
    }));
    const payload = {
      userId: this.auth.current()?.id ?? 'guest',
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value || undefined,
      items,
      total: this.cart.totalPrice(),
      address: {
        line1: this.form.controls.line1.value,
        line2: this.form.controls.line2.value || undefined,
        city: this.form.controls.city.value,
        postalCode: this.form.controls.postalCode.value,
        country: this.form.controls.country.value
      }
    };

    try {
      const order = await this.orders.placeOrder(payload);
      this.cart.clear();
      this.router.navigate(['/checkout', 'success', order.id]);
    } finally {
      this.loading.set(false);
    }
  }
}
