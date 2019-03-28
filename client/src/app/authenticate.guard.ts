import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {UserService} from "./_services/user.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {


  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.userService.currentUserValue;
    if ((currentUser && this.userService.userProfile) || (this.userService.socialSignIn && this.userService.user && this.userService.userProfile)) {
      return true;
    } else {
      this.toastr.warning("You need to login first.");
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      this.userService.logout();
      return false;
    }
  }

}
