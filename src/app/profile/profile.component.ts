import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from './dto/user';
import { UserService } from '../services/user.service';
import { Vendor } from './dto/vendor';
import { EditedData } from './dto/edited-data';
import { MessageService } from 'primeng/api';
import { CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  editedData: EditedData = new EditedData();

  user: User = new User();
  vendor: Vendor = new Vendor();
  loading:boolean=false;
  role!: string;
  showPass:boolean=false;
  showNewPass:boolean=false;
  showNewConfirmedPass:boolean=false;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private userService: UserService,
    private messageService:MessageService
  ){}

  ngOnInit(): void {
    
    let rl = localStorage.getItem('ROLE');
    this.role= rl ? rl : '';
    this.userService.getUserData().subscribe(
      (data) => {
        if (localStorage.getItem('ROLE')=='customer'){
          this.user = data;
        }
        if (localStorage.getItem('ROLE')=='vendor'){
          this.user = data.userDTO;
        }
        this.editedData.paymentMethod = this.user.paymentMethod;
        this.editedData.firstName = this.user.firstName;
        this.editedData.lastName = this.user.lastName;
        this.editedData.phoneNumber = this.user.phoneNumber;
        this.editedData.addresses = this.user.addresses;
        this.editedData.email = this.user.email;
        if (localStorage.getItem('ROLE')=='vendor')
          this.vendor = data;
          this.editedData.companyName = data.companyName;
          this.editedData.taxId = data.taxId;
      }
    )
  }

  validPaymentMethod(){
    if (this.editedData.paymentMethod != this.user.paymentMethod){
      if (this.editedData.paymentMethod == 'credit-card' && this.user.creditCardDTO == null){
        return false;
      } return true;
    }
    else return false; 
  }

  addAddresses(addresses:any[]){
    this.editedData.addresses = addresses;
  }

  removeAddress(index:number){
    this.editedData.addresses.splice(index,1);
  }

  updateView(item:string, form:any){
    if (item="firstLastName") {
      this.user.firstName = this.editedData.firstName;
      this.user.lastName = this.editedData.lastName;
    }
    if (item="email") {
      this.user.email = this.editedData.email;
    }
    if (item="phoneNumber") {
      this.user.phoneNumber = this.editedData.phoneNumber;
    }
    if (item="address") {
      this.user.addresses = this.editedData.addresses;
      this.user.lastName = this.editedData.lastName;
    }
    if (item="businessInfo") {
      this.vendor.companyName = this.editedData.companyName;
      this.vendor.taxId = this.editedData.taxId;
    }
    if (item="paymentMethod"){
      this.user.paymentMethod = this.editedData.paymentMethod;
    }
    if (item="phoneNumber"){
      if (form){
        form.reset();
      }
      this.user.phoneNumber = this.editedData.phoneNumber;
    }
    if (item="password"){
      if (form){
        form.reset();
      }
      this.editedData.password = '';
      this.editedData.newPassword = '';
      this.editedData.newConfirmedPassword = '';
    }
  }

  onEditData(item:string, form?:any){
    if (item =='password' && this.editedData.newPassword != this.editedData.newConfirmedPassword){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
      return;
    }
    if (item=='phoneNumber'){
      this.editedData.phoneNumber = this.editedData.phoneNumberObject.internationalNumber;
    }
    this.loading=true;
    this.userService.editUserData(this.editedData,item).subscribe({
      next: (data:any) => {},
      error: (e:any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      },
      complete: () => {
        this.updateView(item, form);
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Successfully updated' });
      }
    });
  }

}