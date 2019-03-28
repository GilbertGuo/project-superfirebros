import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AboutComponent} from './about/about.component';
import {NavComponent} from './nav/nav.component';
import {PlayComponent} from './play/play.component';
import {SpectateComponent} from './spectate/spectate.component';
import {SettingComponent} from './setting/setting.component';
import {RegisterComponent} from "./login/register/register.component";
import {ProfileComponent} from "./login/profile/profile.component";
import {HttpErrorInterceptor} from "./_services/httpInterceptor";
import {AuthInterceptor} from "./_services/authInterceptor";
import {AuthServiceConfig, GoogleLoginProvider, SocialLoginModule} from "angularx-social-login";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("367409484528-lbk2tvq8de86nt2tauehkf5b0v0j0cql.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}

import {ChatService} from "./chat.service";
import {WebsocketService} from "./websocket.service";

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
    SocialLoginModule,
    ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }
    )
  ],
  providers: [
    {provide: AuthServiceConfig, useFactory: provideConfig},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ChatService,
    WebsocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
