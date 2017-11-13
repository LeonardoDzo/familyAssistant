import { Observable } from 'rxjs/Observable';
import { File } from '../models/file';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UUID } from 'angular2-uuid';

@Injectable()
export class FilesService {
  extensiones: string[];
  archivos: string[];

  constructor(
    public app: FirebaseApp,
    public http: Http,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) { 
    this.http.get('assets/extensiones-imagenes.json').subscribe( res => {
      this.extensiones = res.json();
    });

    this.http.get('assets/extensiones-archivos.json').subscribe( res => {
      this.archivos = res.json();
    });
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  getImageLink(file: File): string {
    let name = file.filename;
    let ext = this.getExt(name)
    if(this.extensiones.indexOf(ext) != -1) {
      return file.downloadUrl
    } else if(this.archivos.indexOf(ext) != -1) {
      return "assets/images/files/" + ext + ".png"
    } 
    return "assets/images/files/_blank.png"
  }

  getFiles(): Observable<File[]> {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.list('safebox/' + uid).valueChanges();
  }

  upload(files: FileList, upload, toast: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    var ref = this.app.storage().ref();
    for (var i = 0; i < files.length; i++) {
      let uuid = UUID.UUID();
      var file = files[i];
      var ext = this.getExt(file.name);
      var imgRef = ref.child('safebox/' + uid + '/' + uuid + "." + ext);
      var uploadTask = imgRef.put(file);
      upload.isUploading = true
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        upload.progress = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
      },
      error => {
        toast.error("Ocurrió un error subiendo el archivo...",null);
        upload.isUploading = false
      },
      () => {
        this.afd.database.ref('safebox/' + uid).push({
          downloadUrl: uploadTask.snapshot.downloadURL,
          filename: file.name
        })
        toast.success("El archivo se subió correctamente.",null)
        upload.isUploading = false
      }
    )
    }
  }
}
