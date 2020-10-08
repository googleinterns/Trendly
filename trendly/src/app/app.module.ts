import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {GoogleChartsModule} from 'angular-google-charts';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CountryInputComponent} from './country-input/country-input.component';
import {DateInputComponent} from './date-input/date-input.component';
import {HistogramSectionComponent} from './histogram-section/histogram-section.component';
import {HistogramyComponentComponent} from './histogramy-component/histogramy-component.component';
import {InputsComponent} from './inputs/inputs.component';
import {IntervalInputComponent} from './interval-input/interval-input.component';
import {MainPageComponent} from './main-page/main-page.component';
import {TermInputComponent} from './term-input/term-input.component';
import {TopBarComponent} from './top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent, MainPageComponent, AppComponent, TopBarComponent,
    HistogramyComponentComponent, InputsComponent, TermInputComponent,
    CountryInputComponent, DateInputComponent, IntervalInputComponent,
    HistogramSectionComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule,
    MatInputModule, MatIconModule, MatAutocompleteModule, MatDatepickerModule,
    MatNativeDateModule, BrowserAnimationsModule, GoogleChartsModule,
    HttpClientModule, RouterModule.forRoot([
      {path: '', component: MainPageComponent},
      {path: 'histogramy', component: HistogramyComponentComponent},
      // { path: 'clusterly', component: MainPageComponent }
    ])
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
