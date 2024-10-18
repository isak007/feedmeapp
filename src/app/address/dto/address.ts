import { Product } from "../../vendor-page/vendor-page.component";

export class Address {
    id!: number;
    addressLine1!:string;
    addressLine2!:string;
    country!:string;
    countryCode!:string;
    city!:string;
    postCode!:string;
    lat!:string;
    lon!:string;
    formatted!:string;
    placeId!:string;
    products!:Product[];
}
