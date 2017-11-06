import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FilesService } from './../../shared/services/files.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Http } from '@angular/http';
import { FormBuilder,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-safebox',
  templateUrl: './safebox.component.html',
  styleUrls: ['./safebox.component.scss'],
  animations: [routerTransition()]
})

export class SafeboxComponent implements OnInit {
  extensiones: string[];
  files: any[];
  upload: any;

  constructor(
    private fs: FilesService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.fs.getFiles().subscribe(files => {
      this.files = files;
    });
    this.upload = {progress: 0, isUploading: false}
  }

  uploadFile($event) {
    const files: FileList = $event.srcElement.files;
    this.fs.upload(files,this.upload,this.toastr);
  }
}
