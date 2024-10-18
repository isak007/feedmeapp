import { Address } from "../../address/dto/address";
import { PhoneNumber } from "../../register/register.component";

export class EditedData {
    firstName!:string;
    lastName!:string;
    email!:string;
    phoneNumber!:string;
    phoneNumberObject!:PhoneNumber;
    addresses!:Address[];
    companyName!:string;
    taxId!:string;
    password!:string;
    newPassword!:string;
    newConfirmedPassword!:string;
    paymentMethod!:string;
}
