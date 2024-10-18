import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/guard/login.guard';
import { MainComponent } from './main/main.component';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from './profile/guard/profile.guard';
import { VendorPageComponent } from './vendor-page/vendor-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'account', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: 'vendor/:vendor-id', component: VendorPageComponent },
  { path: 'account-confirmation/:jwt', component: AccountConfirmationComponent, canActivate: [LoginGuard] },
  { path: 'password-reset/:pass-reset-jwt', component: MainComponent, canActivate: [LoginGuard] },
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
