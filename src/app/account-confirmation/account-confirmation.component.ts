import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrl: './account-confirmation.component.scss'
})
export class AccountConfirmationComponent implements OnInit{
  loading:boolean = true;
  jwt = this.route.snapshot.params['jwt'];
  successful:boolean= false;
  message:string= "";

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activateAccount();
  }

  navigateMain(){
    this.router.navigateByUrl('/');
  }

  activateAccount(){
    this.userService.activateAccount(this.jwt).subscribe({
        next: (data:any)=>{},
        error:(response:any) => {
          if (response.status == 401){
              this.loading = false;
              this.message = response.error.message
              return;
          }
          this.loading = false;
          this.message =
              (response.error &&
              response.error.message)
        },
        complete:() => {
          this.loading = false;
          this.successful = true;
          this.message = "You have successfully activated your account."
      },
    });
  }
}
