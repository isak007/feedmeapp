import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LoginCredentials } from './dto/login-credentials';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { TokenService } from './service/token.service';
import { AuthService } from './service/auth.service';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnChanges {
  loginCredentials: LoginCredentials = new LoginCredentials();
  resultMsg: string = '';
  registerEnabled: boolean = false;
  windowWidth: string = '18.6rem';
  showPass:boolean=false;
  loading:boolean=false;
  passwordResetEnabled:boolean=false;
  passwordResetEmail:string='';
  passResetSendSuccessful:boolean = false;
  @Output() logInMessenger = new EventEmitter<boolean>();
  @Input() passResetJwt!:string;
  @Output() passResetJwtChange = new EventEmitter<string>();
  visible: boolean = false;
  newPassword:string = '';
  newConfirmedPassword:string = '';

  constructor(private loginService:LoginService,
              private tokenService: TokenService,
              private authService: AuthService,
              private userService: UserService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passResetJwt'].currentValue && changes['passResetJwt'].currentValue != "") {
      this.userService.prePasswordResetAuth(this.passResetJwt).subscribe({
        next: (data:any) => {},
        error: (e:any) => {
          this.passResetJwtChange.emit("");
          this.messageService.add({ severity: 'error', summary: "Password change failed", detail: e.error.message });
          this.router.navigateByUrl('/');
        },
        complete: () => {
          this.visible = true;
        }
      });
    } 
  }

  showHidePass(){
    this.showPass = !this.showPass;
  }            
  
  showLoginDialogue(){
    this.visible = true;
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  onLogin(loginForm:any){
    this.loading = true;
    console.log(this.loginCredentials)
    if (!this.loginCredentials.email || !this.loginCredentials.password){
      this.resultMsg = "Invalid email or password";
      this.loading = false;
      return;
    }
    this.loginService.login(this.loginCredentials).subscribe({
      next: (data:any) => {
        const decoded_token = this.tokenService.decodeToken(data.jwt);
        if (decoded_token) {
          this.authService.login(data.jwt, decoded_token.authorities[0].authority);
          this.logInMessenger.emit(true);
          this.router.navigate(["/"])

        } else {
          this.resultMsg = "Server error";
        }
        this.loading = false;
      },
      error: (e:any) => {
        this.resultMsg = "Invalid email or password";
        this.loading = false;
      },
      complete: () => {
        loginForm.reset();
        this.loading = false;
        this.router.navigateByUrl("/")
      }
    });
  }

  onPasswordReset(){
    this.resultMsg='';
    this.loading = true;
    // when user is sending an email with reset link
    if (!this.passResetJwt){
      this.userService.sendPasswordResetCode(this.passwordResetEmail).subscribe({
        next: (data:any) => {},
        error: (e:any) => {
          this.loading = false;
          this.passResetSendSuccessful = false;
          this.resultMsg = e.error.message;
        },
        complete: () => {
          this.loading = false;
          this.passResetSendSuccessful = true;
          this.resultMsg = "Reset link has been sent to this email address. \nThe link will expire in 5 minutes."
        }
      });
    }
    // when user already has reset link and wants to reset password
    else if (this.passResetJwt){
      if (this.newPassword != this.newConfirmedPassword){
        this.resultMsg = 'Passwords do not match.';
        this.loading = false;
        return;
      }
      const passwordResetData = {
        passwordResetJwt : this.passResetJwt,
        newPassword : this.newPassword
      }
      this.userService.passwordReset(passwordResetData).subscribe({
        next: (data:any) => {},
        error: (e:any) => {
          this.loading = false;
          this.passResetSendSuccessful = false;
          this.passResetJwtChange.emit("");
          this.newPassword = '';
          this.newConfirmedPassword = '';
          this.messageService.add({ severity: 'error', summary: "Password change failed", detail: e.error.message });
          this.router.navigateByUrl('/');
        },
        complete: () => {
          this.loading = false;
          this.passResetSendSuccessful = true;
          this.passResetJwtChange.emit("");
          this.newPassword = '';
          this.newConfirmedPassword = '';
          this.messageService.add({ severity: 'success', summary: 'Password changed', detail: 'You can now log in to your account with the new password.' });
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  localStorageItem(id: string): any {
    return localStorage.getItem(id);
  }

  swapRegister(){
    this.registerEnabled=!this.registerEnabled;
    this.resizeWindow();
  }

  swapPasswordReset(){
    if (this.passResetJwt) this.passwordResetEnabled = false;
    else this.passwordResetEnabled = !this.passwordResetEnabled;
    this.passResetSendSuccessful = false;
    this.passResetJwt = '';
    this.newPassword = '';
    this.newConfirmedPassword = '';
    this.passwordResetEmail = '';
    this.resultMsg = '';
  }

  resizeWindow(){
    this.registerEnabled ? this.windowWidth='30rem' : this.windowWidth='18.6rem'
  }
}
