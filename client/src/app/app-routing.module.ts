import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {LoginComponent} from "./login/login.component";
import {AboutComponent} from "./about/about.component";
import {PlayComponent} from "./play/play.component";
import {SpectateComponent} from "./spectate/spectate.component";

const routes: Routes = [
  // {path: '', component: NavComponent},
  {path: 'login', component: LoginComponent},
  {path: 'about', component: AboutComponent},
  {path: 'play', component: PlayComponent},
  {path: 'spectate', component:SpectateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
