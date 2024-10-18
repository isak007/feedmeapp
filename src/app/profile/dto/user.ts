import { Address } from "../../address/dto/address";
import { CreditCardDto } from "../../credit-card-input/dto/credit-card-dto";
import { PhoneNumber } from "../../register/register.component";

export class User {
    id!:number;
    firstName!:string;
    lastName!:string;
    email!:string;
    password!:string;
    phoneNumber!:string;
    phoneNumberObject!:PhoneNumber;
    addresses!:Address[];
    creditCardDTO!:CreditCardDto;
    paymentMethod!:string;
}
