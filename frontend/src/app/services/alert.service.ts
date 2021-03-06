import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments';

declare var UIkit: any;

@Injectable()
export class AlertService {

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(
    private router: Router,
    private http: Http,
    private utilService: UtilService) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
                // only keep for a single location change
                this.keepAfterNavigationChange = false;
              } else {
                // clear alert
                this.subject.next();
              }
            }
          });
  }

  addPushSubscriber(sub: any) {
      return this.http.post(environment.apiUrl+'/subscribe/', sub, this.utilService.jwt());
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    UIkit.notification({
          message: message,
          status: 'success',
          pos: 'bottom-center',
      });
  }

  error(message: string, keepAfterNavigationChange = false) {
    console.log("Error Message:" + message);
    this.keepAfterNavigationChange = keepAfterNavigationChange;

    UIkit.notification({
          message: message,
          status: 'danger',
          pos: 'bottom-center',
      });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
