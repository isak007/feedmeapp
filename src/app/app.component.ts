import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'feedmeapp';
  passResetJwt: string = '';

  onPassResetJwt(event:any){
    if (event.passResetJwt) 
      this.passResetJwt = event.passResetJwt;
  }
}
