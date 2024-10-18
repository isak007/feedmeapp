import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCardValidators } from 'angular-cc-library';
import { CreditCardDto } from './dto/credit-card-dto';
import { TokenService } from '../login/service/token.service';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrl: './credit-card-input.component.scss'
})
export class CreditCardInputComponent implements OnChanges{
  loading:boolean = false;
  @Input() creditCardDto!: CreditCardDto;
  @Output() creditCardDtoChange = new EventEmitter();
  form!: FormGroup;
  submitted: boolean = false;
  cardNumber:string='';
  expDate:string='';
  cvvCode:string='';
  creditCardType:string='';
  ingredient:string='';

  constructor(private _fb: FormBuilder, 
    private userService:UserService,
    private messageService: MessageService,
    private tokenService:TokenService) {
    this.form = this._fb.group({ 
      creditCard:  new FormControl( { value: '', disabled: false }, { validators: [CreditCardValidators.validateCCNumber ]}),
      expirationDate: new FormControl( { value: '', disabled: false }, { validators: [CreditCardValidators.validateExpDate ]}),
      cvc: new FormControl( { value: '', disabled: false }, { validators: [Validators.minLength(3),Validators.maxLength(4),Validators.required ]})
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditCardDto'].currentValue){
      this.cardNumber = this.creditCardDto.cardNumber;
      this.cvvCode = this.creditCardDto.cvvCode;
      this.expDate = this.creditCardDto.expDate;
      this.updateCreditCard();
    }
  }
  updateCreditCard(){
    let value = this.cardNumber.charAt(0);
    if (value != null && this.cardNumber.length > 1){
      if (value == '3'){
        this.creditCardType = 'american-express';
      } 
      else if (value == '4'){
        this.creditCardType = 'visa';
      }
      else if (value == '5'){
        this.creditCardType = 'mastercard';
      }
      else if (value == '6'){
        this.creditCardType = 'discover';
      }
      else{
        this.creditCardType = '';
      }
    } else{
      this.creditCardType = '';
    }
  }

  onSubmit(form: any) {
    this.loading = true;
    if (this.creditCardDto){
      if (this.cardNumber == this.creditCardDto.cardNumber &&
          this.expDate == this.creditCardDto.expDate &&
          this.cvvCode == this.creditCardDto.cvvCode){
            this.messageService.add({ severity: 'error', summary: "Error", detail: "You've made no changes." });
            this.loading=false;
            return;
      }
    }
    let newCreditCardDto = new CreditCardDto();
    newCreditCardDto.userId = this.tokenService.getUserId();
    newCreditCardDto.cardNumber = this.cardNumber;
    newCreditCardDto.expDate = this.expDate;
    newCreditCardDto.cvvCode = this.cvvCode;
    this.userService.addEditCreditCard(newCreditCardDto).subscribe({
        next: (data:any) => {
        },
        error: (e:any) => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: e.error.message }); 
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.creditCardDto = newCreditCardDto;
          this.messageService.add({ severity: 'success', summary: "Success", detail: "You've updated your credit card." });
          this.loading=false;
        }
      })
    }
}
