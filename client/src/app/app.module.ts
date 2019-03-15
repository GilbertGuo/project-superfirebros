import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AboutComponent} from './about/about.component';
import {NavComponent} from './nav/nav.component';
import {PlayComponent} from './play/play.component';
import {SpectateComponent} from './spectate/spectate.component';
import { SettingComponent } from './setting/setting.component';
import {RegisterComponent} from "./login/register/register.component";
import {ProfileComponent} from "./login/profile/profile.component";
import {SocketIoModule} from "ngx-socket-io";

const config = {url: 'http://localhost:4200', option:{}};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    NavComponent,
    PlayComponent,
    SpectateComponent,
    SettingComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
