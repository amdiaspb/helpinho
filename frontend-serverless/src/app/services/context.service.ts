import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private stringInfo = localStorage.getItem("userInfo") as string;
  login = signal<boolean>(!!this.stringInfo);
  userInfo = signal<UserInfo | null>(JSON.parse(this.stringInfo));

  updateLogin(value: boolean, res?: any) {
    this.login.set(value);
    if (res) {
      localStorage.setItem("userInfo", JSON.stringify(res));
      this.userInfo.set(res);
    }
  }
}

export type UserInfo = {
  user: {
    name: string;
    email: string;
    image: string;
  };
  token: string;
}
