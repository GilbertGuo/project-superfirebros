import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = "http://localhost:9000";

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('https://reqres.in/api/users')
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

  delete(id: number) {
    return this.http.delete(`${this.url}/users/` + id);
  }

  login() {
    console.log("123");
    return this.http.get(`${this.url}/users/`).subscribe(
      (data) => console.log('Logged in successfully')
    );
  }

}
