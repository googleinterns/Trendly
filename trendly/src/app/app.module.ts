import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import {MatIconModule} from '@angular/material/icon';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TopBarComponent } from './top-bar/top-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ClusterlyComponent } from './clusterly/clusterly.component';
import { QueriesDialogComponent } from './queries-dialog/queries-dialog.component';
import { DemoMaterialModule } from './material-module';


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
      { path: '', component: MainPageComponent },
      { path: 'histogramy', component: MainPageComponent },
      { path: 'clusterly', component: ClusterlyComponent }
    ])
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
