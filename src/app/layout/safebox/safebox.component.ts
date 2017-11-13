import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FilesService } from './../../shared/services/files.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Http } from '@angular/http';
import { FormBuilder,FormGroup } from '@angular/forms';
import { File } from 'app/shared/models/file'

@Component({
  selector: 'app-safebox',
  templateUrl: './safebox.component.html',
  styleUrls: ['./safebox.component.scss'],
  animations: [routerTransition()]
})

export class SafeboxComponent implements OnInit {
  extensiones: string[];
  realFiles: File[];
  files: File[];
  upload: any;
  searchString: string

  constructor(
    private fs: FilesService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.fs.getFiles().subscribe((files: File[]) => {
      files.sort((a,b) => {
        if(a.filename < b.filename){
          return -1;
        } else if(a.filename > b.filename) {
          return 1;
        }
        return 0;
      });
      this.realFiles = files
      this.files = files;
    });
    this.upload = {progress: 0, isUploading: false}
  }

  search($event) {
    this.files = this.realFiles.filter( item => {
      return item.filename.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });
  }

  getImageLink(file: File): string {
    return this.fs.getImageLink(file);
  }

  uploadFile($event) {
    const files: FileList = $event.srcElement.files;
    this.fs.upload(files,this.upload,this.toastr);
  }
}
