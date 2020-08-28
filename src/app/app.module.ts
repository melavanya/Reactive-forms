import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule, ButtonsModule } from 'angular-bootstrap-md';
import { AutoCompleterModule, InputsModule } from 'ng-uikit-pro-standard'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreationComponent } from './creation/creation.component';
import { TrackingComponent } from './tracking/tracking.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CreationComponent,
    TrackingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    AutoCompleterModule,
    ButtonsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
