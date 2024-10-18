import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials } from '../login/dto/login-credentials';
import { LoginService } from '../login/service/login.service';
import { TokenService } from '../login/service/token.service';
import { AuthService } from '../login/service/auth.service';
import { CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { UserService } from '../services/user.service';
import { Registration } from './dto/registration';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit{
  loginCredentials: LoginCredentials = new LoginCredentials();
  registration: Registration = new Registration();
  resultMsg: string = '';
  @Output() registerEnabled = new EventEmitter<boolean>();
  stateOptions: any[] = [{ label: 'Customer', value: 'customer' },{ label: 'Vendor', value: 'vendor' }];
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  address!:any;
  addresses: any[] = [];
  confirmPasswordValue: string ='';
  showPass:boolean=false;
  showConfirmPass:boolean=false;
  loading:boolean=false;
  registered:boolean=false;
  registeredEmail:string= '';

	changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
 
  constructor(private loginService:LoginService,
              private tokenService: TokenService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.registration.registerAs = 'customer';
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  validForm(){
    if (this.registration.password != this.confirmPasswordValue) {
      this.resultMsg = 'Passwords do not match';
      this.loading = false;
      return false;
    }
    return true;
  }

  switchToLogin(){
    this.registered = false;
    this.registerEnabled.emit(false);
  }

  onRegister(registerForm:any){
    this.loading=true;
    if (!this.validForm()) return;
    this.registration.addresses = this.addresses;
    this.registration.phoneNumber = this.registration.phoneNumberObject.internationalNumber;
    this.userService.register(this.registration).subscribe({
      next: (data:any) => {},
      error: (e:any) => {
        this.resultMsg = e.error.message;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.registered=true;
        this.registeredEmail = this.registration.email;
        registerForm.reset();
      }
    });
  }

  showHidePass(){
    this.showPass = !this.showPass;
  }

  showHideConfirmPass(){
    this.showConfirmPass = !this.showConfirmPass;
  }

  onLogout(){
    this.authService.logout();
  }

  localStorageItem(id: string): any {
    return localStorage.getItem(id);
  }

  addAddresses(addresses:any[]){
    this.address = addresses[addresses.length-1];
    this.addresses = addresses;
  }

  removeAddress(index:number){
    this.addresses.splice(index,1);
  }

}

export interface PhoneNumber{
  countryCode: string;
  dialCode: string;
  e164Number: string;
  internationalNumber:string;
  nationalNumber:string;
  number:string;
}