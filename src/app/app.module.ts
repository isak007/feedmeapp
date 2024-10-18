import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RequestInterceptor } from './request.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MainComponent } from './main/main.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { RegisterComponent } from './register/register.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AddressComponent } from './address/address.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapComponent } from './google-map/google-map.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { ProfileComponent } from './profile/profile.component';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CreditCardInputComponent } from './credit-card-input/credit-card-input.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { VendorPageComponent } from './vendor-page/vendor-page.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UploadImagesComponent } from './upload-images/upload-images.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';


const materialModules = [
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatGridListModule,
];

@NgModule({
  declarations: [
    AppComponent,
    // NavComponent,
    LoginComponent,
    NavBarComponent,
    MainComponent,
    RegisterComponent,
    AddressComponent,
    GoogleMapComponent,
    AccountConfirmationComponent,
    ProfileComponent,
    CreditCardInputComponent,
    VendorPageComponent,
    UploadImagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ToolbarModule,
    AvatarModule,
    AvatarGroupModule,
    NgbModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    StyleClassModule,
    DropdownModule,
    MenubarModule,
    PanelMenuModule,
    BadgeModule,
    TieredMenuModule,
    DataViewModule,
    TagModule,
    CardModule,
    PaginatorModule,
    AutoCompleteModule,
    ScrollPanelModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    DividerModule,
    SelectButtonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    ConfirmPopupModule,
    ToastModule,
    OverlayPanelModule,
    AccordionModule,
    TabViewModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    CreditCardDirectivesModule,
    RadioButtonModule,
    InputTextareaModule,
    MultiSelectModule,
    ...materialModules
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    provideNgxMask(),
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
