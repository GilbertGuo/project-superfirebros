import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "./_services/user.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {


  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.isLoggedin().pipe(tap((res) => {
      if(res === true) {
        return true;
      } else {
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    }));
    // if(this.userService.isLoggedin()) {
    //   return true;
    // }
    // this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    // return false;
  }

}
