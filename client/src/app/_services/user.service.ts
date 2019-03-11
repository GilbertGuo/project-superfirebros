import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfile = undefined;
  private url = "http://localhost:9000";

  constructor(private http: HttpClient) {
  }

  getProfile() {
    return this.userProfile;
  }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  getById(id: number) {
    return this.http.get(`${this.url}/users/` + id);
  }

  register(user: User) {
    return this.http.post(`${this.url}/users/register`, user, {}).subscribe(
      (data) => console.log('Registered in successfully')
    );
  }

  logout() {
    this.http.get(`${this.url}/users/logout`).subscribe((data) => {
      if(data) {
        this.userProfile = undefined;
      }
    });
    return this.isLoggedin();
  }

  login(user: User) {
    return this.http.post(`${this.url}/users/`, user, {}).subscribe(
      (profile) => {
        this.userProfile = profile;
      }
    );
  }

  isLoggedin() {
    if(this.userProfile) {
      return true;
    }
    return false;
  }

}
