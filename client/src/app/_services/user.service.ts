import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../user.model";
import {BehaviorSubject, from, Observable, of} from "rxjs";
import {tap, map} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

/* http://jasonwatmore.com/post/2018/11/16/angular-7-jwt-authentication-example-tutorial#authentication-service-ts */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  userProfile;
  private url = environment.url;
  socialSignIn = false;
  user: SocialUser;
  private loginStatus: boolean;

  constructor(private http: HttpClient,
              private toastr: ToastrService,
              private authService: AuthService,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  setProfile(profile) {
    this.userProfile = profile;
  }

  getProfile(): Observable<any> {
    return of(this.userProfile);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      if(user) {
        this.socialSignIn = true;
      }
    });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        this.userProfile = {name: user.name, email: user.email};
      }
      this.loginStatus = (user != null);
      this.toastr.info("Hey, you just logged in.");
      this.router.navigate(['/profile']);
    })
  }

  register(user: User) {
    return this.http.post(`${this.url}/users/register`, user, {}).pipe(tap());
  }

  verifyEmail(email) {
    return this.http.post<any>(`${this.url}/users/email/verification`, {email: email}, {}).pipe(map(res => {
      if(res.success) {
        this.toastr.success("verification code should be in your mailbox, check it now");
      } else {
        this.toastr.error(res.msg);
      }
    }));
  }

  // https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  logout(): Observable<any> {
    if (!this.socialSignIn) {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      return this.http.get(`${this.url}/users/logout`).pipe(tap((data) => {
        if (data) {
          this.userProfile = {};
        }
      }));
    } else {
      this.socialSignIn = false;
      this.user = null;
      this.userProfile = {};
      return from(this.authService.signOut());
    }
  }

  //https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  //https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
  login(user: User) {
    return this.http.post<any>(`${this.url}/users/`, user, {}).pipe(map(res => {
      if (res.success && res.token) {
        this.currentUserSubject.next(res);
        localStorage.setItem('currentUser', JSON.stringify(res));
      }
      return res;
    }));
  }

}
