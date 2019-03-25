import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../user.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {tap, map} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

/* http://jasonwatmore.com/post/2018/11/16/angular-7-jwt-authentication-example-tutorial#authentication-service-ts */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private userProfile = {};
  private url = "https://localhost:9000";
  // private httpOptions = {
  //   headers: new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('currentUser')).token })
  // };

  constructor(private http: HttpClient, private tostr: ToastrService) {
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

  register(user: User) {
    return this.http.post(`${this.url}/users/register`, user, {}).pipe(tap());
  }

  // https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    return this.http.get(`${this.url}/users/logout`).pipe(tap((data) => {
      if (data) {
        this.userProfile = {};
      }
    }));
  }

  //https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  //https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
  login(user: User) {
    return this.http.post<any>(`${this.url}/users/`, user, {}).pipe(map(res => {
      if(res.success && res.token) {
        this.currentUserSubject.next(res);
        localStorage.setItem('currentUser', JSON.stringify(res));
      }
      return res;
    }));
  }

  // https://stackoverflow.com/questions/46866202/return-observableboolean-from-service-method-after-two-subscriptions-resolve
  // isLoggedin(): Observable<boolean> {
  //   return this.http.get(`${this.url}/users/c`, this.httpOptions).pipe(map((res: any) => {
  //     console.log(res);
  //     return !!(res.name && res.email);
  //   }))
  // }

}
