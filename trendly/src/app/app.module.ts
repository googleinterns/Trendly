import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router'

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClusterlyComponent} from './clusterly/clusterly.component';
import {MainPageComponent} from './main-page/main-page.component';
import {TopBarComponent} from './top-bar/top-bar.component';

@NgModule({
  declarations:
      [AppComponent, MainPageComponent, TopBarComponent, ClusterlyComponent],
  imports: [
    BrowserModule, AppRoutingModule, MatIconModule, RouterModule.forRoot([
      {path: '', component: MainPageComponent},
      {path: 'histogramy', component: MainPageComponent},
      {path: 'clusterly', component: ClusterlyComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
