import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ProductsComponent } from './container/products/products.component';
import * as fromOgma from './store/ogma.reducer';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromOgma.productsFeatureKey, fromOgma.reducer),
  ]
})
export class ProductsModule { }