import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Sidebar } from 'primeng/sidebar';
import { AuthService } from '../login/service/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../login/service/token.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  @Input() passResetJwt!:string;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private messageService: MessageService,
    private router:Router
  ){}

  closeCallback(e:any): void {
      this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;
  showUserPopup: boolean = false;

  items: MenuItem[] | undefined;

  ngOnInit(): void {
      this.updateLoginPopup();
  }

  updateLoginPopup() {
    console.log(localStorage.getItem('ROLE'));
    if (localStorage.getItem('ROLE') == 'customer'){
    this.items = [
        {
          label: 'Your orders',
          icon: 'pi pi-shopping-bag',
          routerLink: 'orders'
        },
        {
          label: 'Favorties',
          icon: 'pi pi-heart',
          routerLink: 'favorites'
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          routerLink: 'account'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.onLogout(),
        },
    ]}
    else if (localStorage.getItem('ROLE') == 'vendor'){
      this.items = [
        {
          label: 'Manage your page',
          icon: 'pi pi-shopping-bag',
          routerLink: 'vendor/'+this.tokenService.getUserId()
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          routerLink: 'account'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.onLogout(),
        }
      ]
    }
  }

  logInMessenger(event:any){
    this.updateLoginPopup();
    this.messageService.add({ severity: 'success', summary: 'Logged in', detail: "You have logged in successfully." });
  }

  onLogout(){
    this.messageService.add({ severity: 'secondary', summary: 'Logged out', detail: "You are logged out." });
    this.authService.logout();
    this.items=[];
    this.router.navigateByUrl('/');
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  getFirstName(){
    return localStorage.getItem("FIRST_NAME");
  }

}
