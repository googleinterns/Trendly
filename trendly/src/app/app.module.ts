import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ClusterlyComponent } from './clusterly/clusterly.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ClusterlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'histogramy', component: MainPageComponent },
      { path: 'clusterly', component: ClusterlyComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
