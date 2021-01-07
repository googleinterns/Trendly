import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router'
import {GoogleChartsModule} from 'angular-google-charts'

import {AddClusterDialogComponent} from './add-cluster-dialog/add-cluster-dialog.component';
import {AddSimilarDialogComponent} from './add-similar-dialog/add-similar-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CategoryInputComponent} from './category-input/category-input.component';
import {ClusterlyInputsComponent} from './clusterly-inputs/clusterly-inputs.component';
import {ClusterlyComponent} from './clusterly/clusterly.component';
import {ClustersSectionComponent} from './clusters-section/clusters-section.component';
import {CountryInputComponent} from './country-input/country-input.component';
import {DateInputComponent} from './date-input/date-input.component';
import {DeleteConfirmationDialogComponent} from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import {HistogramSectionComponent} from './histogram-section/histogram-section.component';
import {HistogramyComponentComponent} from './histogramy-component/histogramy-component.component';
import {InputsComponent} from './histogramy-inputs/histogramy-inputs.component';
import {IntervalInputComponent} from './interval-input/interval-input.component';
import {MainPageComponent} from './main-page/main-page.component';
import {DemoMaterialModule} from './material-module';
import {QueriesDialogComponent} from './queries-dialog/queries-dialog.component';
import {TermInputComponent} from './term-input/term-input.component';
import {TermsChipsInputComponent} from './terms-chips-input/terms-chips-input.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import { MergeDialogComponent } from './merge-dialog/merge-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppComponent,
    TopBarComponent,
    QueriesDialogComponent,
    ClustersSectionComponent,
    HistogramyComponentComponent,
    InputsComponent,
    TermInputComponent,
    CountryInputComponent,
    DateInputComponent,
    IntervalInputComponent,
    HistogramSectionComponent,
    ClusterlyInputsComponent,
    ClusterlyComponent,
    TermsChipsInputComponent,
    AddClusterDialogComponent,
    CategoryInputComponent,
    DeleteConfirmationDialogComponent,
    AddSimilarDialogComponent,
    MergeDialogComponent,
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
      {path: '', component: MainPageComponent},
      {path: 'histogramy', component: HistogramyComponentComponent},
      {path: 'clusterly', component: ClusterlyComponent}
    ]),
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    HttpClientModule,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
