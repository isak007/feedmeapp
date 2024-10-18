import { Component, EventEmitter, Input, IterableDiffer, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AddressService } from './service/address.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Address } from './dto/address';


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnChanges{
  resultType:string = 'building';
  selectedAddress!: any;
  filteredAddresses: string[] = [];
  addressDisabled:boolean=false;
  @Output() addressesOutput = new EventEmitter<any[]>();
  @Input() registerAs!:string ;
  @Input() addresses!: any[];
  showMap: boolean = false;
  iterableDiffer:IterableDiffer<any>;


  constructor(private addressService: AddressService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private iterableDiffers: IterableDiffers,) {
      this.iterableDiffer = iterableDiffers.find([]).create(undefined);
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['registerAs'] && 
      changes['registerAs'].currentValue == 'vendor') {
      this.addresses = [];
      this.resetAddress()
    }
    let changesAddresses = this.iterableDiffer.diff(this.addresses);
    if (changesAddresses) {
      let newAddresses: any[]=[];
      changesAddresses.forEachItem((i)=>{
        newAddresses.push(i.item);
      })
      this.addresses=newAddresses;
      if (localStorage.getItem('ROLE') == 'customer'){
        if (this.addresses && newAddresses[0]){
          this.selectedAddress = this.addresses[0].formatted;
          this.addressDisabled = true;
        }
        else{
          this.selectedAddress = '';
          this.addressDisabled = false;
        }
      }
    }
  }

  filterAddress(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    this.addressService.getAddressList(query).subscribe((data) => {
      for (let key in data.features){
          let address = data.features[key].properties
          if (address.result_type==this.resultType) filtered.push(address);
      }
      this.filteredAddresses = filtered;
    });
  }

  addressSelected(address:any){
    if (this.registerAs == 'customer'){
      this.selectedAddress = address.formatted;
      this.addressDisabled = true;
    } else if (this.registerAs == 'vendor') {
      this.resetAddress()
    }
    // if address already exist don't add it
    for (let add of this.addresses){
      if (add.formatted == address.formatted) return;
    }
    this.addresses.push(address);
    this.addressesOutput.emit(this.addresses);
  }

  resetAddress(){
    if (this.registerAs == 'customer'){
      this.addresses = [];
    }
    this.selectedAddress = null;
    this.addressDisabled = false;
    this.addressesOutput.emit(this.addresses);
  }

  updateAddresses(addresses:any){
    this.addresses = addresses;
    this.addressesOutput.emit(this.addresses);
    // setting address field to selected address and disabling it
    if (this.registerAs == 'customer' && addresses.length != 0){
      this.selectedAddress = this.addresses[this.addresses.length-1].formatted;
      this.addressDisabled = true;
    }
    // resetting address field if address is removed from map
    else if (this.registerAs == 'customer' && addresses.length == 0){
      this.resetAddress();
    }
  }

}
