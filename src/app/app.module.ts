import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { AppComponent } from './app.component';
import { PositiveNumberOnlyDirective } from './positive-number-only.directive';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PositiveNumberOnlyDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
