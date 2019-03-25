import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "./_services/user.service";
import {tap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {


  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.userService.currentUserValue;
    if (currentUser) {
      return true;
    } else {
      this.toastr.warning("You idiot need to login first.");
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    // return this.userService.isLoggedin().pipe(tap((res) => {
    //   if(res) {
    //     return true;
    //   } else {
    //     this.toastr.warning("You idiot need to login first.");
    //     this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    //     return false;
    //   }
    // }));
  }

}
