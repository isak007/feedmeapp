import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('TOKEN', token);
  }

  removeToken() {
    localStorage.removeItem('TOKEN');
  }

  getUserId(): number {
    let token: string = localStorage.getItem('TOKEN') as string;
    let decoded_token = this.decodeToken(token);
    let userId = decoded_token.userId;
    return userId;
  }

  getFirstName(): string{
    let token: string = localStorage.getItem('TOKEN') as string;
    let decoded_token = this.decodeToken(token);
    let firstName = decoded_token.firstName;
    return firstName;
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    }
    catch (error) {
      console.log(error);
      return null;
    }
  }

}
