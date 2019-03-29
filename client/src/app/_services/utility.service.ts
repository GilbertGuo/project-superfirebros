import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public home = true;

  backHome() {
    this.home = true;
  }

  leaveHome() {
    this.home = false;
  }
}
