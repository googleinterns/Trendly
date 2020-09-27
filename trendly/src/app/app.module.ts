import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import {GoogleChartsModule} from 'angular-google-charts'


import { TopBarComponent } from './top-bar/top-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HistogramyComponentComponent } from './histogramy-component/histogramy-component.component';
import { InputsComponent } from './inputs/inputs.component';
import { TermInputComponent } from './term-input/term-input.component';
import { CountryInputComponent } from './country-input/country-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { IntervalInputComponent } from './interval-input/interval-input.component';
import { HistogramSectionComponent } from './histogram-section/histogram-section.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ClusterlyComponent } from './clusterly/clusterly.component';
import { QueriesDialogComponent } from './queries-dialog/queries-dialog.component';
import { DemoMaterialModule } from './material-module';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppComponent,
    TopBarComponent,
    QueriesDialogComponent,
    ClusterlyComponent
    HistogramyComponentComponent,
    InputsComponent,
    TermInputComponent,
    CountryInputComponent,
    DateInputComponent,
    IntervalInputComponent,
    HistogramSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    GoogleChartsModule,
    HttpClientModule,
    DemoMaterialModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'histogramy', component: HistogramyComponentComponent},
      { path: 'clusterly', component: ClusterlyComponent }
    ])
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
