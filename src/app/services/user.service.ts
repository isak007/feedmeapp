import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Registration } from '../register/dto/registration';
import { environment } from '../../environments/environment';
import { TokenService } from '../login/service/token.service';
import { EditedData } from '../profile/dto/edited-data';
import { CreditCardDto } from '../credit-card-input/dto/credit-card-dto';
import { Observable } from 'rxjs';
import { Vendor } from '../profile/dto/vendor';

 
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
  private http:HttpClient,
  private tokenService:TokenService) { 
    //console.log(environment.apiEndpoint);
  }

  fetchVendorPicture(vendorId: number): Observable<Blob>{
    return this.http.get(`${environment.apiEndpoint}/vendors/vendor-picture`,
      {
        responseType: "blob",
        params: {
          vendorId: vendorId,
        }
      }
    );
  }

  fetchProductPicture(productId: number): Observable<Blob>{
    return this.http.get(`${environment.apiEndpoint}/vendors/product-picture`,
      {
        responseType: "blob",
        params: {
          productId: productId,
        }
      }
    );
  }

  getCityList(queryString: string){
    return this.http.get<any>(`${environment.apiEndpoint}/users/city-list`,
        {
             params: {
                queryString: queryString,
             }
        }
      );
  }

  getUserData(){
    if (localStorage.getItem('ROLE') == 'vendor'){
      return this.http.get<any>(`${environment.apiEndpoint}/vendors/fetch/${this.tokenService.getUserId()}`);
    }
    return this.http.get<any>(`${environment.apiEndpoint}/users/fetch/${this.tokenService.getUserId()}`);
  }

  getVendorData(vendorId: number){
    return this.http.get<any>(`${environment.apiEndpoint}/vendors/fetch-page-data/${vendorId}`);
  }

  getAllVendors(){
    return this.http.get<any>(`${environment.apiEndpoint}/vendors/get-all`);
  }

  editUserData(editedData: EditedData,item:string){
    console.log(item);
    return this.http.put<any>(`${environment.apiEndpoint}/users`, editedData,{
      params:{
        item:item
      }
    });
  }


  editVendorPage(editedVendor: Vendor){
    return this.http.put<any>(`${environment.apiEndpoint}/vendors`, editedVendor);
  }

  addEditCreditCard(creditCardDto:CreditCardDto){
    return this.http.post<any>(`${environment.apiEndpoint}/credit-cards/create-edit`, creditCardDto);
  }

  register(registration: Registration){
    console.log(registration);
    return this.http.post<any>(`${environment.apiEndpoint}/users/register`, registration);
  }
  activateAccount(jwt: string) {
    return this.http.get<any>(`${environment.apiEndpoint}/users/account-activation`,{params: {
      jwt: jwt
    }})
  }

  sendPasswordResetCode(email: string) {
    return this.http.get<any>(`${environment.apiEndpoint}/users/send-password-reset-code`,{params: {
      email: email
    }})
  }

  passwordReset(passResetData: Object) {
    return this.http.post<any>(`${environment.apiEndpoint}/users/password-reset`,passResetData)
  }

  prePasswordResetAuth(passResetJwt: string) {
    return this.http.get<any>(`${environment.apiEndpoint}/users/pre-password-reset-auth`,{params: {
      jwt: passResetJwt
    }})
  }
}

