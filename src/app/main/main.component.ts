import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { Vendor } from '../profile/dto/vendor';
import { ProductPicture } from '../vendor-page/vendor-page.component';
// import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  vendors: any[] = [];
  vendorsWithPictures: VendorPicture[] = [];
  vendorsPage: any[] = [];
  productsWithPictures: ProductPicture[] = [];
  first1: number = 0;
  rows1: number = 5;
  pastPageFirst: number = 0;
  products: any[] = []
  selectedProduct: any;
  filteredProducts: any[] = [];
  passResetJwt = this.route.snapshot.params['pass-reset-jwt'];

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.userService.getAllVendors().subscribe(
      (data)=>{
        this.vendors = data;
        for (let vendor of this.vendors){
          this.userService.fetchVendorPicture(vendor.userDTO.id).subscribe(
            (data)=>{
              const imageBlob = new Blob([data])
              const imageObjectURL = URL.createObjectURL(imageBlob);
              let vendorPicture = new VendorPicture();
              vendorPicture.vendor = vendor;
              vendorPicture.imageObjectURL = imageObjectURL;
              this.vendorsWithPictures.push(vendorPicture);
              this.vendorsPage = this.vendorsWithPictures.slice(0,5);
            },
            (error)=>{
              console.log("Error ",error);
          });
        }
      },
      (error)=>{
        console.log("Error while fetching vendors - ",error);
      });

    this.productService.getAll().subscribe(
      (data)=>{
        this.products = data;
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
      },
      (error)=>{
        console.log("Error while fetching products - ",error);
      });
  }

  findVendorPage(event:any){
    let vendorId = event.value.product.vendorId
    this.router.navigateByUrl('vendor/'+vendorId);
  }

  onPageChange1(event: any) {
      var element = document.getElementById('container');
      element?.addEventListener('animationend', () => {
        this.first1 = event.first;
        this.rows1 = event.rows;
        this.pastPageFirst = this.first1;
        this.vendorsPage = this.vendors.slice(this.first1,this.first1+5);
      });

      if (event.first < this.pastPageFirst){
        element?.classList.remove('paginatorBackAnim')
        element?.classList.remove('paginatorForwardAnim')
        element?.offsetWidth; // trigger reflow
        element?.classList.add('paginatorForwardAnim')
      }
      else if (event.first > this.pastPageFirst){
        element?.classList.remove('paginatorBackAnim')
        element?.classList.remove('paginatorForwardAnim')
        element?.offsetWidth; // trigger reflow
        element?.classList.add('paginatorBackAnim')
      }
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.productsWithPictures as any[]).length; i++) {
        let productWithPicture = (this.productsWithPictures as any[])[i];
        if (productWithPicture.product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(productWithPicture);
        }
    }

    this.filteredProducts = filtered;
  }

}

export class VendorPicture{
  vendor!: Vendor;
  imageObjectURL!: string;
}