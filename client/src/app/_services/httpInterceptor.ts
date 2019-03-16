// https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192#toc-a-better-solution-with-httpinterceptor
import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
        let msg;
        if (err.error instanceof ErrorEvent) {
          // client-side error
          msg = `Error: ${err.error.message}`;
        } else {
          // server-side error
          msg = `Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        this.toastr.error(msg);
        return throwError(msg);
      }));
  }
}
