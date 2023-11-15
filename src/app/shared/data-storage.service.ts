import { Injectable } from '@angular/core';
import { AuthService } from '../components/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  // fetchPatientes() {
  //   if (this.authService.user) {
  //     return this.authService.user.pipe(
  //       take(1),
  //       exhaustMap((user) => {
  //         return this.http.get<User>('', {
  //           params: new HttpParams().set('auth', user.token ? ' ' : 'dd')
  //         });
  //       })
  //     );
  //   } else {
  //     return ''
  //   }
  // }
}
