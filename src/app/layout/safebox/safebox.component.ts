import { FileDatabase } from './../../shared/models/file-database';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FilesService } from './../../shared/services/files.service';
import { Component, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Http } from '@angular/http';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';
import { NgIf } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import * as pako from "pako"


@Component({
  selector: 'app-safebox',
  templateUrl: './safebox.component.html',
  styleUrls: ['./safebox.component.scss'],
  animations: [routerTransition()]
})

export class SafeboxComponent implements OnInit {
  extensiones: string[];
  realFiles: FileDatabase[];
  files: FileDatabase[];
  upload: any;
  searchString: string
  sub: Subscription;
  private parent: string = 'root';
  options: ResizeOptions
  public modalRef: BsModalRef;
  folderName: string
  navigation: FileDatabase[] = []
  userSub: Subscription;
  constructor(
    private fs: FilesService,
    private toastr: ToastsManager,
    private imageCompressService: ImageCompressService,
    private modalService: BsModalService,
    vcr: ViewContainerRef
  ) { 
    this.toastr.setRootViewContainerRef(vcr); 
  }

  private init() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.fs.getFiles().subscribe((files: FileDatabase[]) => {
      files.sort((a,b) => {
        if(a.filename < b.filename){
          return -1;
        } else if(a.filename > b.filename) {
          return 1;
        }
        return 0;
      });
      this.realFiles = files
      this.files = files.filter((elem) => {
        return elem.parent == this.parent
      });
    }, error => {

    });
  }

  changeParent(parent: string) {
    let ind = this.navigation.findIndex((obj) => {
      return obj.id == parent;
    })
    this.navigation = this.navigation.slice(0,ind+1)
    this.parent = parent
    this.files = this.realFiles.filter((elem) => {
        return elem.parent == this.parent
      });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.userSub = this.fs.getUser().subscribe(() => {
      this.navigation = [new FileDatabase('root','root','folder')]
      this.parent = "root"
      this.init();
    }, error => {

    });
    this.upload = {progress: 0, isUploading: false}
    this.options = new ResizeOptions()
    this.options.Resize_Max_Height = 200;
    this.options.Resize_Max_Width = 300;
    this.options.Resize_Quality = 100;
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.userSub.unsubscribe();
    this.fs.destroy();
  }

  search($event) {
    this.files = this.realFiles.filter( item => {
      return item.filename.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1 && item.parent == this.parent;
    });
  }

  getImageLink(file: FileDatabase): string {
    return this.fs.getImageLink(file);
  }

  private dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  changeFolder(file: FileDatabase) {
    this.parent = file.id
    this.navigation.push(file)
    this.files = this.realFiles.filter((elem) => {
        return elem.parent == this.parent
      });
  }

  createFolder() {
    if(this.folderName) {
      this.fs.createFolder(this.folderName,this.parent) 
    }
    this.modalRef.hide()
  }

  uploadFile($event) {
    let images: Array<IImage> = [];
    const files: FileList = $event.target.files;
    if(this.fs.isImage(files)){
      this.upload.isUploading = true;
      ImageUtilityService.filesArrayToSourceImages([files[0]]).subscribe(sourceImage => {
        ImageCompressService.compressImage(sourceImage,this.options,
          (sourceImageCompressed: IImage) => {
            let compressedImageFile = this.dataURLtoFile(
              sourceImageCompressed.compressedImage.imageDataUrl,
              files[0].name
            )
            this.fs.upload(this.parent,files[0],this.upload,this.toastr,compressedImageFile)
        })
      })
    } else {
      this.fs.upload(this.parent,files[0],this.upload,this.toastr);
    }
  }
}
