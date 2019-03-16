import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../user.model";
import {Observable, Subject, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfile = {};
  private url = "https://localhost:9000";

  constructor(private http: HttpClient,  private tostr:ToastrService) {
  }

  private setProfile(profile) {
    this.userProfile = profile;
  }

  getProfile(): Observable<any> {
    return of(this.userProfile);
  }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  getById(id: number) {
    return this.http.get(`${this.url}/users/` + id);
  }

  register(user: User) {
    return this.http.post(`${this.url}/users/register`, user, {})
  }

  // https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  logout() {
    return this.http.get(`${this.url}/users/logout`).pipe(tap((data) => {
      if (data) {
        this.userProfile = {};
      }
    }));
  }

  //https://stackoverflow.com/questions/54888671/angular-6-wait-for-subscribe-to-finish
  //https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
  login(user: User) {
    return this.http.post(`${this.url}/users/`, user, {}).pipe(tap(
      (profile) => {
        this.setProfile(profile);

      }
    ))
  }

  // https://stackoverflow.com/questions/46866202/return-observableboolean-from-service-method-after-two-subscriptions-resolve
  isLoggedin(): Observable<boolean> {
    let stat = false;
    this.getProfile().subscribe((profile) => {
      stat = !!(profile.name && profile.email);
    });
    return of(stat);
  }

}
