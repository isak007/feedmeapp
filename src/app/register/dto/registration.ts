import { Address } from "../../address/dto/address";
import { PhoneNumber } from "../register.component";

export class Registration {
    registerAs!:string;
    firstName!:string;
    lastName!:string;
    email!:string;
    password!:string;
    phoneNumber!:string;
    phoneNumberObject!:PhoneNumber;
    companyName!:string;
    taxId!:string;
    addresses!:Address[];
}
