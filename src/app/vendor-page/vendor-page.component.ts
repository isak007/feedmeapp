import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../profile/dto/user';
import { Vendor } from '../profile/dto/vendor';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { MessageService } from 'primeng/api';
import { TokenService } from '../login/service/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Address } from '../address/dto/address';

@Component({
  selector: 'app-vendor-page',
  templateUrl: './vendor-page.component.html',
  styleUrl: './vendor-page.component.scss'
})
export class VendorPageComponent {
  products:Product[] = [];
  product: Product = new Product();
  vendor: Vendor = new Vendor();
  vendorPicture: string = '';
  editedVendor: Vendor = new Vendor();
  address: string = '';
  loading:boolean=false;
  addProductVisible:boolean = false;
  updatePageVisible:boolean = false;
  vendorId = this.route.snapshot.params['vendor-id'];
  productsWithPictures: ProductPicture[] = [];
  addressesFormGroup!: FormGroup;
  selectedAddress: Address | undefined;

  constructor(private tokenService: TokenService,
    private messageService: MessageService,
    private productService:ProductService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute){
      this.route.params.subscribe(params => {
          this.vendorId = params['vendor-id'];
          this.fetchData();
      });
  }

  fetchData(){
    this.userService.getVendorData(this.vendorId).subscribe({
      next: (data:any) => {
        this.vendor = data;
        this.selectedAddress = this.vendor.userDTO?.addresses[0];
        let products = this.selectedAddress?.products;
        this.products = products ? products : [];
        this.initializeVendor();      
        this.fetchVendorPicture();
        this.fetchProductsPictures();
      },
      error: (e:any) => {
        console.log(e.error.message);
        this.router.navigateByUrl('/');
      },
      complete: () => {}
    });
  }

  fetchVendorPicture(){
    this.userService.fetchVendorPicture(this.vendor.userDTO.id).subscribe(
      (data)=>{
        const imageBlob = new Blob([data])
        const imageObjectURL = URL.createObjectURL(imageBlob);
        this.vendorPicture = imageObjectURL;
      },
      (error)=>{
        console.log("Error ",error);
    });
  }

  fetchProductsPictures(){
    this.productsWithPictures = [];
    for (let prod of this.products){
      this.userService.fetchProductPicture(prod.id).subscribe(
        (data)=>{
          const imageBlob = new Blob([data])
          const imageObjectURL = URL.createObjectURL(imageBlob);
          let productPicture = new ProductPicture();
          productPicture.product = prod;
          productPicture.imageObjectURL = imageObjectURL;
          this.productsWithPictures.push(productPicture);
        },
        (error)=>{
          console.log("Error ",error);
      });
    }
  }

  updateProducts(){
    this.products = this.selectedAddress?.products ? this.selectedAddress?.products : [];
    this.fetchProductsPictures();
  }

  initializeVendor(){
    this.editedVendor.userDTO = this.vendor.userDTO;
    this.editedVendor.companyName = this.vendor.companyName;
    this.editedVendor.description = this.vendor.description;
    this.editedVendor.deliveryTime = this.vendor.deliveryTime;
    this.editedVendor.deliveryCost = this.vendor.deliveryCost;
  }

  validVendorForm(){
    if ((!this.editedVendor.pictureBase64 || !this.editedVendor.pictureName) &&
      this.editedVendor.companyName == this.vendor.companyName &&
      this.editedVendor.description == this.vendor.description &&
      this.editedVendor.deliveryTime == this.vendor.deliveryTime &&
      this.editedVendor.deliveryCost == this.vendor.deliveryCost){
      return false;
    }
    return true;
  }

  getUserId(){    
    return this.tokenService.getUserId();
  }
  getRole(){
    return localStorage.getItem('ROLE');
  }

  showAddProduct(){
    if (this.vendor.userDTO.addresses.length == 0){
      return this.messageService.add({ severity: 'info', summary: 'No address set', detail: "Please add an address to be able to add products" });
    }
    if (!this.selectedAddress){
      this.messageService.add({ severity: 'error', summary: 'Unexpected error', detail: "Address not selected" });
      return;
    }
    this.product.addressId = this.selectedAddress.id;
    this.addProductVisible = true;
  }
  showUpdatePage(){
    this.updatePageVisible = true;
  }
  
  onUpdatePage(){
    if (!this.validVendorForm()){
      this.messageService.add({ severity: 'error', summary: 'No changes', detail: "You've made no changes" });
      return;
    }
    this.loading = true;
    this.userService.editVendorPage(this.editedVendor).subscribe({
      next: (data:any) => {},
      error: (e:any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      },
      complete: () => {
        this.vendor.companyName = this.editedVendor.companyName;
        this.vendor.description = this.editedVendor.description;
        this.vendor.deliveryTime = this.editedVendor.deliveryTime;
        this.vendor.deliveryCost = this.editedVendor.deliveryCost;
        if (this.editedVendor.pictureBase64 && this.editedVendor.pictureName){
          this.vendor.pictureBase64 = this.editedVendor.pictureBase64;
          this.vendor.pictureName = this.editedVendor.pictureName
          this.vendorPicture = this.editedVendor.pictureBase64;
        }
        this.editedVendor = new Vendor();
        this.initializeVendor();
        this.updatePageVisible = false;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Page successfully updated" });
      }
    });
  }
  onAddProduct(){
    this.loading = true;
    this.productService.addProduct(this.product).subscribe({
      next: (data:any) => {
        this.product.id = data.id;
      },
      error: (e:any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      },
      complete: () => {
        let productPicture = new ProductPicture();
        productPicture.product = this.product;
        this.productsWithPictures.push(productPicture);
        this.selectedAddress?.products.push(this.product);
        this.product = new Product();
        this.addProductVisible = false;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Product successfully added" });
      }
    });
  }

  onDeleteProduct(productId:number){
    this.loading = true;
    this.productService.deleteProduct(productId).subscribe({
      next: (data:any) => {},
      error: (e:any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      },
      complete: () => {
        for (let item of this.productsWithPictures){
          if (item.product.id == productId){
            this.productsWithPictures.splice(this.productsWithPictures.indexOf(item),1);
            break;
          }
        }
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Product successfully removed" });
      }
    });
  }
}

export class Product{
  id!:number;
  addressId!:number;
  name!:string;
  description!:string;
  price!:number;
  pictureName!:string;
  pictureBase64!:string;
}

export class ProductPicture{
  product!:Product;
  imageObjectURL!: string;
}