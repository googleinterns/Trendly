import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router'

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClusterlyComponent} from './clusterly/clusterly.component';
import {MainPageComponent} from './main-page/main-page.component';
import {DemoMaterialModule} from './material-module';
import {QueriesDialogComponent} from './queries-dialog/queries-dialog.component';
import {TopBarComponent} from './top-bar/top-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TopBarComponent,
    ClusterlyComponent,
    QueriesDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    DemoMaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', component: MainPageComponent},
      {path: 'histogramy', component: MainPageComponent},
      {path: 'clusterly', component: ClusterlyComponent},
    ]),
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
