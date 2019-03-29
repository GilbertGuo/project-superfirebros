// https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192#toc-a-better-solution-with-httpinterceptor
import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {UserService} from "./user.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService, private userService:UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
        let msg = err.error.message || err.statusText;
        if (err.status === 401) {
          this.userService.logout();
          msg = `${err.status}\n ${msg}`;
        }
        if (err.error instanceof ErrorEvent) {
          msg = `Error: ${msg}`;
        } else {
          msg = `${msg}`;
        }
        this.toastr.error(msg);
        return throwError(msg);
      }));
  }
}
