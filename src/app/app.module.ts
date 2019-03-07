import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { CardModule} from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

import { PhonePickerComponent } from './shared/components/phone-picker/phone-picker.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PhonePickerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
  ],
  providers: [],       
  bootstrap: [AppComponent],
  exports: [
    DropdownModule,
    ButtonModule,
  ]
})
export class AppModule { }
