import { Component, EventEmitter, Input, IterableDiffer, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AddressService } from '../address/service/address.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit {
  markers: Marker[] = [];
  options: google.maps.MapOptions = {
    mapId: '7a8f8b65ffc0b48c',
    center: { lat: -31, lng: 147 },
    zoom: 8,
  };
  draggedMarkerLabel = '';
  draggedMarkerLat = '';
  draggedMarkerLng = '';
  @Input() registerAs!: string;
  @Output() addressesOutput = new EventEmitter<Object[]>();
  @Input() addresses: any[] = [];
  iterableDiffer:IterableDiffer<any>;
  addressError!: string;
  resultType:string = 'building';
  locating:boolean=false;

  constructor(private addressService: AddressService,
    private iterableDiffers: IterableDiffers,
    private messageService: MessageService){
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
  }

  ngDoCheck() {
    // removing markers when users remove address while map is open
    let changes = this.iterableDiffer.diff(this.addresses);
    if (changes && this.markers.length > this.addresses.length) {
      for (let marker of this.markers){
        let exist = false;
        for (let address of this.addresses){
          if (marker.label == address.formatted){
            exist = true;
            break;
          }
        }
        if (!exist) this.markers.splice(this.markers.indexOf(marker),1)
      }
    }

    // adding new markers when user adds address while map is open
    if (this.addresses)
      for (let address of this.addresses){
        let hasMarker = false;
        for (let marker of this.markers){
          if (marker.label == address.formatted){
            hasMarker = true;
            break;
          }
        }
        if (!hasMarker) {
          this.markers.push({
            location : {
              lat: +address.lat,
              lng: +address.lon
            }, 
            draggable: true,
            label: address.formatted
          });
        }
      }
  }

  ngOnInit(): void {
      this.initializeMarkers(this.addresses);
  }
  initializeMarkers(addresses: any[]){
    if (addresses)
      for (let address of addresses){
        this.markers.push({
          location : {
            lat: address.lat,
            lng: address.lon
          }, 
          draggable: true,
          label: address.formatted
        });
      }
  }

  getLocation(): void{
    this.locating = true;
    // collecting user lat and lon then searching address based on that
    if (navigator.geolocation) {
      this.addressService.getUserAddress().subscribe(
        (address) => {
          console.log(address);
          this.addressService.getAddressFromCoord(address.location.latitude,address.location.longitude).subscribe(
            (data) => {
              let address = data.results[0];
              this.options =
                {
                  mapId: '7a8f8b65ffc0b48c',
                  center: { lat: address.lat, lng: address.lon },
                  zoom: 8,
                };
              this.locating = false;
             }
          )
        }
      );
    } else {
       console.log("No support for geolocation")
       this.locating = false;
    }
  }

  mapClicked(event:any){
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    this.addressService.getAddressFromCoord(lat,lng).subscribe(
      (data) => {
        let newAddress = data.results[0];
        // if new address is invalid (not building)
        if (newAddress.result_type != this.resultType) {
          this.messageService.add({ severity: 'error', summary: 'Invalid address', detail: 'Make sure to select a building or residence' });
          return;
        }
        // checking if new address already exists
        for (let address of this.addresses){
          if (address.formatted == newAddress.formatted){
            this.messageService.add({ severity: 'error', summary: 'Invalid address', detail: 'You already added this address' });
            return;
          }
        }
        // if selecting address as a customer, only one can be added
        // thus removing previous selection if there was any
        if (this.addresses.length > 0 && this.registerAs == 'customer') {
          this.markers = [];
          this.addresses = [];
        }
        this.markers.push({
          location : {
            lat: lat,
            lng: lng
          }, 
          draggable: true,
          label: newAddress.formatted
        });
        this.addresses.push(newAddress);
        this.addressesOutput.emit(this.addresses);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address added' });
      }
    );
  }

  markerClicked(event:any){
    let lat = event.latLng.lat().toString();
    let lng = event.latLng.lng().toString();
    let i = null;
    for (let marker of this.markers){
      if (marker.location.lat.toString() == lat && marker.location.lng.toString() == lng){
        i = this.markers.indexOf(marker);
        break;
      }
    }

    if (i != null) {
      for (let address of this.addresses){
        if (address.formatted == this.markers[i].label){
          console.log('found')
          this.markers.splice(i,1);
          this.addresses.splice(this.addresses.indexOf(address),1);
          this.addressesOutput.emit(this.addresses);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address removed' });
          break;
        }
      }
    }
    else console.log('Marker Error!');
  }

  markerDragStarted(event:any){
    let lat = event.latLng.lat().toString();
    let lng = event.latLng.lng().toString();
    for (let marker of this.markers){
      if (marker.location.lat.toString() == lat && marker.location.lng.toString() == lng){
        if (marker.label) {
          this.draggedMarkerLat = lat;
          this.draggedMarkerLng = lng;
          this.draggedMarkerLabel = marker.label;
        }
        break;
      }
    }
  }

  markerDragEnded(event:any){
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    this.addressService.getAddressFromCoord(lat,lng).subscribe(
      (data) => {
        let newAddress = data.results[0];
        let oldAddress = null;
        let alreadyExist = false;
        for (let address of this.addresses){
          if (address.formatted == newAddress.formatted)
            alreadyExist = true;
          if (address.formatted == this.draggedMarkerLabel)
            oldAddress = address;
        }
        for (let marker of this.markers){
          if (marker.label == this.draggedMarkerLabel){
            // if new address is invalid (not building)
            if (newAddress.result_type != this.resultType) {
              marker.location = { lat: +this.draggedMarkerLat, lng: +this.draggedMarkerLng };
              this.messageService.add({ severity: 'error', summary: 'Invalid address', detail: 'Make sure to select a building or residence' });
              return;
            }
            // if new address already exists
            if (alreadyExist){
              marker.location = { lat: +this.draggedMarkerLat, lng: +this.draggedMarkerLng };
              this.messageService.add({ severity: 'error', summary: 'Invalid address', detail: 'You already added this address' });
              return;
            }
            marker.location = { lat: lat, lng: lng };
            marker.label = newAddress.formatted;
            this.addresses.splice(this.addresses.indexOf(oldAddress),1);
            this.addresses.push(newAddress);
            this.addressesOutput.emit(this.addresses);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address updated' });
            return;
          }
        }
        return;
      }
    );
  }
}

interface Marker {
  location : { lat: number; lng: number; }
	label?: string;
	draggable: boolean;
}
