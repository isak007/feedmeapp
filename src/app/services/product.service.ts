import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../login/service/token.service';
import { Product } from '../vendor-page/vendor-page.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http:HttpClient,
    private tokenService:TokenService) { 
  }
  
  addProduct(product:Product){
    return this.http.post<any>(`${environment.apiEndpoint}/products/create`, product);
  }

  searchProducts(productName:string){
    return this.http.get<any>(`${environment.apiEndpoint}/products/search`, {
      params:{
        productName: productName
      }
    });
  }

  getAll(){
    return this.http.get<any>(`${environment.apiEndpoint}/products/get-all`);
  }

  deleteProduct(productId:number){
    return this.http.delete<any>(`${environment.apiEndpoint}/products/delete`, {
      params : {
        productId: productId
      }
    });
  }
}
