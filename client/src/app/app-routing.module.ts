import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AboutComponent} from "./about/about.component";
import {PlayComponent} from "./play/play.component";
import {SpectateComponent} from "./spectate/spectate.component";
import {RegisterComponent} from "./login/register/register.component";
import {ProfileComponent} from "./login/profile/profile.component";
import {UserService} from "./_services/user.service";
import {AuthenticateGuard} from "./authenticate.guard";

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate:[AuthenticateGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'about', component: AboutComponent},
  {path: 'play', component: PlayComponent},
  {path: 'spectate', component:SpectateComponent,canActivate:[AuthenticateGuard]},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UserService, AuthenticateGuard]
})
export class AppRoutingModule {
}
