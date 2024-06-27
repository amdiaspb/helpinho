import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  userSignup(body: any) {
    return this.http.post('api/user', body);
  }

  userLogin(body: any) {
    return this.http.post('api/auth', body);
  }

  createHelp(body: any) {
    return this.http.post('api/help', body);
  }

  getAllHelps() {
    return this.http.get<any[]>('api/help');
  }

  getUserInfo() {
    return this.http.get<any>('api/user');
  }

  getHelp(id: number) {
    return this.http.get<any>('api/help/' + id);
  }

  donate(body: any) {
    return this.http.post('api/donation', body);
  }

  getDevInfo() {
    return this.http.get<any>('api/user/dev');
  }
}
