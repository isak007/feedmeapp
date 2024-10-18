import { User } from "./user";

export class Vendor {
    userDTO!: User;
    companyName!: string;
    description!:string;
    deliveryTime!:number;
    deliveryCost!:number;
    taxId!: string;
    pictureBase64!: string;
    pictureName!: string;
}
