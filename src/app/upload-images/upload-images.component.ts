import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';
import { Product } from '../vendor-page/vendor-page.component';
import { Vendor } from '../profile/dto/vendor';


@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.scss'
})
export class UploadImagesComponent implements OnInit, OnChanges {

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  showList: boolean = false;

  @Input() product!:Product;
  @Output() productChange = new EventEmitter<Product>();

  @Input() editedVendor!:Vendor;
  @Output() editedVendorChange = new EventEmitter<Vendor>();

  constructor(private uploadService: FileUploadService) { }
  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // remove picutre from select input when adding is finished
    if (!changes['product']?.currentValue.pictureBase64 && this.product){
      this.imageInfos = this.uploadService.getFiles();
      this.selectedFiles = undefined;
      this.selectedFileNames = [];
      this.progressInfos = [];
      this.message = [];
      this.previews = [];
      this.imageInfos = undefined;
      this.showList = false;
    }
    if (!changes['editedVendor']?.currentValue.pictureBase64 && this.editedVendor){
      this.imageInfos = this.uploadService.getFiles();
      this.selectedFiles = undefined;
      this.selectedFileNames = [];
      this.progressInfos = [];
      this.message = [];
      this.previews = [];
      this.imageInfos = undefined;
      this.showList = false;
    }
  }
  
  getList(): void {
    this.showList = true;
    this.imageInfos = this.uploadService.getFiles();
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
  
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          if (this.product){
            this.product.pictureBase64 = e.target.result;
            this.product.pictureName = this.selectedFiles?.[i].name ? this.selectedFiles?.[i].name : '';
          } else if (this.editedVendor){
            this.editedVendor.pictureBase64 = e.target.result;
            this.editedVendor.pictureName = this.selectedFiles?.[i].name ? this.selectedFiles?.[i].name : '';
          }
          this.previews.push(e.target.result);
        };
  
        reader.readAsDataURL(this.selectedFiles[i]);
        
  
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }
  uploadFiles(): void {
    this.message = [];
    this.showList = false;
  
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            const msg = file.name + ': Successful!';
            this.message.push(msg);
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          let msg = file.name + ': Failed!';
  
          if (err.error && err.error.message) {
            msg += ' ' + err.error.message;
          }
  
          this.message.push(msg);
        }
      });
    }
  }
}