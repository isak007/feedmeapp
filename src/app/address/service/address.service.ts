import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addressApi = "https://api.geoapify.com/v1/geocode/search";
  private apiKey = '293d8cdde4bc4e068c31858ea29e3963';

  constructor(private http: HttpClient) { }

  getAddressList(query: string){
    return this.http.get<any>(this.addressApi,
      {
           params: {
              text: query,
              apiKey: this.apiKey
           }
      }
    );
  }

  getAddressFromCoord(lat: number,lng: number){
    return this.http.get<any>(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${this.apiKey}`);
  }
  getUserAddress(){
    return this.http.get<any>(`https://api.geoapify.com/v1/ipinfo?apiKey=${this.apiKey}`);
  }

}
